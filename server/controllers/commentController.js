const Comment = require("../models/Comment");
const Project = require("../models/Project");

// Add comment
const addComment = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { content, lineNumber, parentComment } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const comment = await Comment.create({
            project: projectId,
            user: req.user._id,
            content,
            lineNumber,
            parentComment
        });

        const populatedComment = await Comment.findById(comment._id)
            .populate('user', 'username avatar');

        // Trigger Notification for Project Owner
        if (project.owner.toString() !== req.user._id.toString()) {
            try {
                const Notification = require("../models/Notification");
                await Notification.create({
                    user: project.owner,
                    type: 'comment_added',
                    title: "New Commentary",
                    message: `${req.user.username} logged a comment on ${project.name}`,
                    link: `/project/${project._id}`
                });
            } catch (nErr) {
                console.error("Comment notification failed:", nErr);
            }
        }

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error("Add comment error:", error);
        res.status(500).json({ message: "Failed to add comment", error: error.message });
    }
};

// Get project comments
const getComments = async (req, res) => {
    try {
        const { projectId } = req.params;
        const comments = await Comment.find({ project: projectId })
            .populate('user', 'username avatar')
            .populate('parentComment')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error("Get comments error:", error);
        res.status(500).json({ message: "Failed to fetch comments", error: error.message });
    }
};

// Delete comment
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You can only delete your own comments" });
        }

        await Comment.findByIdAndDelete(commentId);
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Delete comment error:", error);
        res.status(500).json({ message: "Failed to delete comment", error: error.message });
    }
};

module.exports = { addComment, getComments, deleteComment };
