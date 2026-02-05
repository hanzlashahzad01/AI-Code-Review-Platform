const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    aiAnalysis: { type: String, required: true }, // JSON string or text analysis
    bugs: [{
        line: Number,
        issue: String,
        severity: { type: String, enum: ['Low', 'Medium', 'High'] },
        category: { type: String, enum: ['Security', 'Performance', 'Bug', 'Style', 'Optimization'] },
        suggestion: String
    }],
    score: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
