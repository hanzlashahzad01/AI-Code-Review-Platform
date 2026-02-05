const mongoose = require("mongoose");

const pullRequestSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    description: { type: String },
    sourceVersion: { type: mongoose.Schema.Types.ObjectId, ref: "Version", required: true },
    targetVersion: { type: mongoose.Schema.Types.ObjectId, ref: "Version" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["open", "merged", "closed"], default: "open" },
    aiReview: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
    mergedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    mergedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("PullRequest", pullRequestSchema);
