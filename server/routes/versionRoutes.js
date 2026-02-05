const express = require("express");
const { createVersion, getVersions, getVersion, compareVersions } = require("../controllers/versionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:projectId", protect, createVersion);
router.get("/:projectId", protect, getVersions);
router.get("/single/:versionId", protect, getVersion);
router.get("/compare/:version1Id/:version2Id", protect, compareVersions);

module.exports = router;
