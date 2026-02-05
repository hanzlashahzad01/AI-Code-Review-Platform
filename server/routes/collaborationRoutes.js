const express = require("express");
const { inviteCollaborator, getCollaborators, removeCollaborator } = require("../controllers/collaborationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:projectId/invite", protect, inviteCollaborator);
router.get("/:projectId", protect, getCollaborators);
router.delete("/:projectId/:collaboratorId", protect, removeCollaborator);

module.exports = router;
