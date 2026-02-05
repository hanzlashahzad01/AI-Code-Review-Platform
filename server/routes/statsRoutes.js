const express = require("express");
const { getUserStats } = require("../controllers/statsController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getUserStats);

module.exports = router;
