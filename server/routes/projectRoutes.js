const express = require("express");
const router = express.Router();
const { createProject, getProjects, getProjectById, upload } = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, upload.single("file"), createProject).get(protect, getProjects);
router.route("/:id").get(protect, getProjectById);

module.exports = router;
