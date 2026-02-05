const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes (Placeholder)
app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));
app.use("/api/collaborators", require("./routes/collaborationRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));
app.use("/api/versions", require("./routes/versionRoutes"));
app.use("/api/pull-requests", require("./routes/pullRequestRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
