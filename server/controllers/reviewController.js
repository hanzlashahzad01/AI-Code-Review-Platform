const Review = require("../models/Review");
const Project = require("../models/Project");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateReview = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey || apiKey === 'your_gemini_api_key' || apiKey.length < 10) {
            return res.status(400).json({
                message: "API Key Missing",
                error: "Please enter your GEMINI_API_KEY in the .env file."
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Try fallback models if flash fails
        const modelNames = [
            "gemini-flash-latest",
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-pro-latest",
            "gemini-2.0-pro",
            "gemini-1.5-pro"
        ];
        let lastError = null;
        let successResult = null;

        const prompt = `
        You are a Senior Principal Software Engineer and Security Researcher with 20+ years of experience.
        Analyze the following ${project.language} code with extreme precision.
        
        CRITERIA:
        1. LOGIC & BUGS: Identify memory leaks, edge cases, or incorrect algorithms.
        2. SECURITY: Find SQL injection, XSS, insecure storage, or weak authentication.
        3. PERFORMANCE: Spot unnecessary loops, heavy operations, or poorly optimized queries.
        4. BEST PRACTICES: Check for DRY, SOLID, naming conventions, and modularity.
        
        CODE CONTENT:
        ${project.codeContent}
        
        OUTPUT RULES:
        - Return ONLY a valid JSON object.
        - "score" (0-100) based on overall quality.
        - "summary" a comprehensive technical breakdown.
        - "reviews" array of objects with:
            - "line": line number (integer)
            - "issue": clear technical explanation
            - "category": choose from ['Security', 'Performance', 'Bug', 'Style', 'Optimization']
            - "severity": choose from ['High', 'Medium', 'Low']
            - "suggestion": precise code-level fix or improvement
            
        JSON FORMAT:
        {
          "reviews": [...],
          "score": 85,
          "summary": "This code follows..."
        }
        `;

        for (const modelName of modelNames) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.1,
                        responseMimeType: "application/json",
                    }
                });
                const response = await result.response;
                successResult = response.text();
                if (successResult) break;
            } catch (err) {
                lastError = err;
                console.log(`Model ${modelName} failed:`, err.message);
                if (err.message.includes("API_KEY_INVALID") || err.message.includes("403")) {
                    break; // No point trying other models if key is invalid
                }
            }
        }

        if (!successResult) {
            let userMsg = "AI Engine Connection Failed";
            if (lastError?.message.includes("404")) {
                userMsg = "Model Not Found: Aapki API Key Gemini models ko support nahi kar rahi.";
            } else if (lastError?.message.includes("API_KEY_INVALID")) {
                userMsg = "Invalid API Key: Key sahi tarah se copy nahi hui.";
            }

            return res.status(502).json({
                message: userMsg,
                error: lastError?.message,
                tip: "Make sure you enabled 'Generative Language API' in Google Cloud or get a fresh key from 'Google AI Studio'."
            });
        }

        const cleanJson = successResult.replace(/```json|```/g, "").trim();
        const analysisResult = JSON.parse(cleanJson);

        const review = await Review.create({
            project: projectId,
            aiAnalysis: analysisResult.summary || "Analysis complete.",
            bugs: analysisResult.reviews || [],
            score: analysisResult.score || 0
        });

        project.reviews.push(review._id);
        await project.save();

        // Trigger Notification
        try {
            const Notification = require("../models/Notification");
            await Notification.create({
                user: req.user._id,
                type: 'review_complete',
                title: "Core Analysis Complete",
                message: `Project ${project.name} has been reviewed. Quality Score: ${review.score}%`,
                link: `/project/${project._id}`
            });
        } catch (nErr) {
            console.error("Notification trigger failed:", nErr);
        }

        res.status(201).json(review);

    } catch (error) {
        console.error("System Failure:", error);
        res.status(500).json({ message: "Internal Server Fault.", error: error.message });
    }
};

const getProjectReviews = async (req, res) => {
    try {
        const { projectId } = req.params;
        const reviews = await Review.find({ project: projectId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching reviews" });
    }
};

module.exports = { generateReview, getProjectReviews };
