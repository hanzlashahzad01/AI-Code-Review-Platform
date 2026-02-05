const Collaborator = require("../models/Collaborator");
const Project = require("../models/Project");
const User = require("../models/User");

// Invite a collaborator
const inviteCollaborator = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { email, role } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if user is owner
        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only project owner can invite collaborators" });
        }

        // Find user by email
        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if already a collaborator
        const existingCollaborator = await Collaborator.findOne({
            project: projectId,
            user: userToInvite._id
        });

        if (existingCollaborator) {
            return res.status(400).json({ message: "User is already a collaborator" });
        }

        const collaborator = await Collaborator.create({
            project: projectId,
            user: userToInvite._id,
            role: role || "viewer",
            invitedBy: req.user._id,
            status: "accepted" // Auto-accept for simplicity
        });

        project.collaborators.push(collaborator._id);
        await project.save();

        const populatedCollaborator = await Collaborator.findById(collaborator._id)
            .populate('user', 'username email');

        res.status(201).json(populatedCollaborator);
    } catch (error) {
        console.error("Invite collaborator error:", error);
        res.status(500).json({ message: "Failed to invite collaborator", error: error.message });
    }
};

// Get project collaborators
const getCollaborators = async (req, res) => {
    try {
        const { projectId } = req.params;
        const collaborators = await Collaborator.find({ project: projectId })
            .populate('user', 'username email avatar')
            .populate('invitedBy', 'username');

        res.json(collaborators);
    } catch (error) {
        console.error("Get collaborators error:", error);
        res.status(500).json({ message: "Failed to fetch collaborators", error: error.message });
    }
};

// Remove collaborator
const removeCollaborator = async (req, res) => {
    try {
        const { projectId, collaboratorId } = req.params;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only project owner can remove collaborators" });
        }

        await Collaborator.findByIdAndDelete(collaboratorId);
        project.collaborators = project.collaborators.filter(
            c => c.toString() !== collaboratorId
        );
        await project.save();

        res.json({ message: "Collaborator removed successfully" });
    } catch (error) {
        console.error("Remove collaborator error:", error);
        res.status(500).json({ message: "Failed to remove collaborator", error: error.message });
    }
};

module.exports = { inviteCollaborator, getCollaborators, removeCollaborator };
