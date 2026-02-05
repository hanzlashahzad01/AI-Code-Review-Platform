const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    codeContent: { type: String, required: true },
    language: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collaborator" }],
    versions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Version" }],
    currentVersion: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
