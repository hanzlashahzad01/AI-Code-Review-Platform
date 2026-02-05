const express = require("express");
const { addComment, getComments, deleteComment } = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:projectId", protect, addComment);
router.get("/:projectId", protect, getComments);
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
