const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
        type: String,
        enum: ['review_complete', 'comment_added', 'team_invite', 'version_created'],
        required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String }, // e.g., /project/:id
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
