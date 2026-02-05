const express = require("express");
const { getNotifications, markAsRead, markAllAsRead } = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/mark-all", protect, markAllAsRead);
router.put("/:id", protect, markAsRead);

module.exports = router;
