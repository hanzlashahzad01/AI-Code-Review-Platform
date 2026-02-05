const express = require("express");
const { generateReview, getProjectReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:projectId/analyze", protect, generateReview);
router.get("/:projectId", protect, getProjectReviews);

module.exports = router;
