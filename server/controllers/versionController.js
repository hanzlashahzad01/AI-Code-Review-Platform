const Version = require("../models/Version");
const Project = require("../models/Project");

// Create new version
const createVersion = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { codeContent, description } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const newVersionNumber = project.currentVersion + 1;

        const version = await Version.create({
            project: projectId,
            versionNumber: newVersionNumber,
            codeContent,
            description,
            createdBy: req.user._id
        });

        project.versions.push(version._id);
        project.currentVersion = newVersionNumber;
        project.codeContent = codeContent; // Update main code content
        await project.save();

        const populatedVersion = await Version.findById(version._id)
            .populate('createdBy', 'username');

        // Trigger Notification
        if (project.owner.toString() !== req.user._id.toString()) {
            try {
                const Notification = require("../models/Notification");
                await Notification.create({
                    user: project.owner,
                    type: 'version_created',
                    title: "State Snapshot Captured",
                    message: `${req.user.username} created version v${newVersionNumber} for ${project.name}`,
                    link: `/project/${project._id}`
                });
            } catch (nErr) {
                console.error("Version notification failed:", nErr);
            }
        }

        res.status(201).json(populatedVersion);
    } catch (error) {
        console.error("Create version error:", error);
        res.status(500).json({ message: "Failed to create version", error: error.message });
    }
};

// Get project versions
const getVersions = async (req, res) => {
    try {
        const { projectId } = req.params;
        const versions = await Version.find({ project: projectId })
            .populate('createdBy', 'username avatar')
            .sort({ versionNumber: -1 });

        res.json(versions);
    } catch (error) {
        console.error("Get versions error:", error);
        res.status(500).json({ message: "Failed to fetch versions", error: error.message });
    }
};

// Get specific version
const getVersion = async (req, res) => {
    try {
        const { versionId } = req.params;
        const version = await Version.findById(versionId)
            .populate('createdBy', 'username avatar');

        if (!version) {
            return res.status(404).json({ message: "Version not found" });
        }

        res.json(version);
    } catch (error) {
        console.error("Get version error:", error);
        res.status(500).json({ message: "Failed to fetch version", error: error.message });
    }
};

// Compare two versions
const compareVersions = async (req, res) => {
    try {
        const { version1Id, version2Id } = req.params;

        const [version1, version2] = await Promise.all([
            Version.findById(version1Id),
            Version.findById(version2Id)
        ]);

        if (!version1 || !version2) {
            return res.status(404).json({ message: "One or both versions not found" });
        }

        res.json({
            version1: {
                number: version1.versionNumber,
                code: version1.codeContent,
                description: version1.description
            },
            version2: {
                number: version2.versionNumber,
                code: version2.codeContent,
                description: version2.description
            }
        });
    } catch (error) {
        console.error("Compare versions error:", error);
        res.status(500).json({ message: "Failed to compare versions", error: error.message });
    }
};

module.exports = { createVersion, getVersions, getVersion, compareVersions };
