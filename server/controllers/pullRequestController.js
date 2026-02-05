const PullRequest = require("../models/PullRequest");
const Project = require("../models/Project");
const Version = require("../models/Version");
const Review = require("../models/Review");
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Create pull request
const createPullRequest = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description, sourceVersionId } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const sourceVersion = await Version.findById(sourceVersionId);
        if (!sourceVersion) {
            return res.status(404).json({ message: "Source version not found" });
        }

        const pullRequest = await PullRequest.create({
            project: projectId,
            title,
            description,
            sourceVersion: sourceVersionId,
            createdBy: req.user._id
        });

        const populatedPR = await PullRequest.findById(pullRequest._id)
            .populate('createdBy', 'username avatar')
            .populate('sourceVersion');

        res.status(201).json(populatedPR);
    } catch (error) {
        console.error("Create PR error:", error);
        res.status(500).json({ message: "Failed to create pull request", error: error.message });
    }
};

// Get project pull requests
const getPullRequests = async (req, res) => {
    try {
        const { projectId } = req.params;
        const pullRequests = await PullRequest.find({ project: projectId })
            .populate('createdBy', 'username avatar')
            .populate('sourceVersion')
            .populate('aiReview')
            .sort({ createdAt: -1 });

        res.json(pullRequests);
    } catch (error) {
        console.error("Get PRs error:", error);
        res.status(500).json({ message: "Failed to fetch pull requests", error: error.message });
    }
};

// AI review for pull request
const reviewPullRequest = async (req, res) => {
    try {
        const { prId } = req.params;

        const pullRequest = await PullRequest.findById(prId)
            .populate('sourceVersion')
            .populate('project');

        if (!pullRequest) {
            return res.status(404).json({ message: "Pull request not found" });
        }

        const prompt = `
        You are an expert code reviewer. Analyze the following code changes for a pull request.
        
        Language: ${pullRequest.project.language}
        
        New Code:
        ${pullRequest.sourceVersion.codeContent}
        
        Current Code:
        ${pullRequest.project.codeContent}
        
        Please provide a detailed code review in strict JSON format with the following structure:
        {
            "reviews": [
                {
                    "line": <line_number>,
                    "issue": "<issue_description>",
                    "severity": "<Low|Medium|High>",
                    "suggestion": "<fix_suggestion>"
                }
            ],
            "score": <quality_score_0_to_100>,
            "summary": "<overall_summary_of_code_quality>",
            "recommendation": "<approve|request_changes|reject>"
        }
        
        Focus on:
        1. Breaking changes
        2. Security vulnerabilities
        3. Performance regressions
        4. Code quality improvements
        `;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant that reviews code." },
                { role: "user", content: prompt }
            ],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content);

        const review = await Review.create({
            project: pullRequest.project._id,
            aiAnalysis: result.summary,
            bugs: result.reviews,
            score: result.score
        });

        pullRequest.aiReview = review._id;
        await pullRequest.save();

        res.json({ review, recommendation: result.recommendation });
    } catch (error) {
        console.error("PR review error:", error);
        res.status(500).json({ message: "Failed to review pull request", error: error.message });
    }
};

// Merge pull request
const mergePullRequest = async (req, res) => {
    try {
        const { prId } = req.params;

        const pullRequest = await PullRequest.findById(prId)
            .populate('sourceVersion')
            .populate('project');

        if (!pullRequest) {
            return res.status(404).json({ message: "Pull request not found" });
        }

        const project = await Project.findById(pullRequest.project._id);

        if (project.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Only project owner can merge PRs" });
        }

        // Update project code
        project.codeContent = pullRequest.sourceVersion.codeContent;
        await project.save();

        // Update PR status
        pullRequest.status = "merged";
        pullRequest.mergedBy = req.user._id;
        pullRequest.mergedAt = new Date();
        await pullRequest.save();

        res.json({ message: "Pull request merged successfully", pullRequest });
    } catch (error) {
        console.error("Merge PR error:", error);
        res.status(500).json({ message: "Failed to merge pull request", error: error.message });
    }
};

module.exports = { createPullRequest, getPullRequests, reviewPullRequest, mergePullRequest };
