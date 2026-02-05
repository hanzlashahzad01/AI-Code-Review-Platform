const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (notification && notification.user.toString() === req.user._id.toString()) {
            notification.isRead = true;
            await notification.save();
        }
        res.json({ message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification" });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: "All marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating notifications" });
    }
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
