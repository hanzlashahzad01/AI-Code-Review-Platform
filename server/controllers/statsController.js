const Project = require("../models/Project");
const Review = require("../models/Review");

const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Total projects
        const totalProjects = await Project.countDocuments({ owner: userId });

        // Get all projects with reviews
        const projects = await Project.find({ owner: userId }).populate('reviews');

        // Calculate total bugs detected
        let totalBugs = 0;
        let totalScore = 0;
        let reviewedProjects = 0;

        projects.forEach(project => {
            if (project.reviews && project.reviews.length > 0) {
                const latestReview = project.reviews[project.reviews.length - 1];
                totalBugs += latestReview.bugs ? latestReview.bugs.length : 0;
                if (latestReview.score) {
                    totalScore += latestReview.score;
                    reviewedProjects++;
                }
            }
        });

        // Calculate average code quality
        const avgCodeQuality = reviewedProjects > 0 ? Math.round(totalScore / reviewedProjects) : 0;

        // Bug severity breakdown
        const bugsBySeverity = { High: 0, Medium: 0, Low: 0 };
        projects.forEach(project => {
            if (project.reviews && project.reviews.length > 0) {
                const latestReview = project.reviews[project.reviews.length - 1];
                if (latestReview.bugs) {
                    latestReview.bugs.forEach(bug => {
                        if (bugsBySeverity[bug.severity] !== undefined) {
                            bugsBySeverity[bug.severity]++;
                        }
                    });
                }
            }
        });

        res.json({
            totalProjects,
            totalBugs,
            avgCodeQuality,
            reviewedProjects,
            bugsBySeverity,
            recentProjects: projects.slice(0, 5).map(p => ({
                _id: p._id,
                name: p.name,
                language: p.language,
                createdAt: p.createdAt,
                reviewCount: p.reviews.length
            }))
        });

    } catch (error) {
        console.error("Stats error:", error);
        res.status(500).json({ message: "Failed to fetch statistics", error: error.message });
    }
};

module.exports = { getUserStats };
