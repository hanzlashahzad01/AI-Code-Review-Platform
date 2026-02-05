const express = require("express");
const { createPullRequest, getPullRequests, reviewPullRequest, mergePullRequest } = require("../controllers/pullRequestController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:projectId", protect, createPullRequest);
router.get("/:projectId", protect, getPullRequests);
router.post("/:prId/review", protect, reviewPullRequest);
router.post("/:prId/merge", protect, mergePullRequest);

module.exports = router;
