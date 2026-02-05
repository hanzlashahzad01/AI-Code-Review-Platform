const Project = require("../models/Project");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = "uploads/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Allow ZIP and code files
    const allowedTypes = [".js", ".py", ".cpp", ".java", ".go", ".rs", ".ts", ".jsx", ".tsx", ".zip"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only code files or ZIP archives are allowed."));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Increased to 10MB for projects
});

const createProject = async (req, res) => {
    try {
        const { name, description, language } = req.body;
        let codeContent = req.body.codeContent;
        let filesList = [];

        // If file uploaded
        if (req.file) {
            const ext = path.extname(req.file.originalname).toLowerCase();

            if (ext === '.zip') {
                // Handle ZIP file
                const zip = new AdmZip(req.file.path);
                const zipEntries = zip.getEntries();
                let combinedContent = "";

                zipEntries.forEach((entry) => {
                    const entryExt = path.extname(entry.entryName).toLowerCase();
                    const processableExts = [".js", ".py", ".cpp", ".java", ".go", ".rs", ".ts", ".jsx", ".tsx"];

                    if (!entry.isDirectory && processableExts.includes(entryExt)) {
                        const content = entry.getData().toString("utf8");
                        combinedContent += `\n/* --- FILE: ${entry.entryName} --- */\n${content}\n`;
                        filesList.push(entry.entryName);
                    }
                });

                codeContent = combinedContent || "// No readable code files found in ZIP";
            } else {
                // Handle single code file
                codeContent = fs.readFileSync(req.file.path, "utf8");
                filesList.push(req.file.originalname);
            }

            // Delete the file after reading
            fs.unlinkSync(req.file.path);
        }

        if (!name || !codeContent || !language) {
            return res.status(400).json({ message: "Please fill in all required fields" });
        }

        const project = await Project.create({
            name,
            description,
            codeContent,
            language,
            owner: req.user._id,
        });

        // Create initial version v1 for history
        try {
            const Version = require("../models/Version");
            const version = await Version.create({
                project: project._id,
                versionNumber: 1,
                codeContent: codeContent,
                description: "Initial foundation commit",
                createdBy: req.user._id
            });
            project.versions.push(version._id);
            await project.save();
        } catch (vErr) {
            console.error("Initial version creation failed:", vErr);
        }

        res.status(201).json(project);
    } catch (error) {
        console.error("Project creation error:", error);
        res.status(500).json({ message: "Failed to create project", error: error.message });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            // Check if user is owner or collaborator
            // (Simple check for owner for now, can be expanded)
            if (project.owner.toString() !== req.user._id.toString()) {
                // Later: check Collaborator model
            }
            res.json(project);
        } else {
            res.status(404).json({ message: "Project not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProject, getProjects, getProjectById, upload };
