const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lineNumber: { type: Number },
    content: { type: String, required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, // For threaded discussions
}, { timestamps: true });

module.exports = mongoose.model("Comment", commentSchema);
