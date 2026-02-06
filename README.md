# 🚀 AI Code Review & Bug Detection Platform

> A comprehensive MERN stack platform that uses AI to analyze code, detect bugs, suggest improvements, and provide quality reports.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.x-blue.svg)

## ✨ Features

### 🔐 Authentication & User Management
- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ GitHub-style Profile Pages
- ✅ Profile Editing (Username, GitHub Link, Avatar)

### 📁 Project Management
- ✅ Create Projects
- ✅ **File Upload Support** (.js, .py, .cpp, .java, .go, .rs, .ts, .jsx, .tsx)
- ✅ **Code Paste Option**
- ✅ **File Type Validation** (Security)
- ✅ **5MB Size Limit** (Security)
- ✅ Auto-detect Language from File Extension

### 🤖 AI Code Review (CORE FEATURE)
- ✅ **OpenAI GPT-4 Integration**
- ✅ **Bug Detection** with Line Numbers
- ✅ **Security Vulnerability Detection**
- ✅ **Code Smell Detection**
- ✅ **Optimization Suggestions**
- ✅ **Best Practice Recommendations**
- ✅ **Severity Levels** (High/Medium/Low)
- ✅ **Quality Score** (0-100)
- ✅ **Detailed Suggestions** for Each Issue

### 💻 Code Editor
- ✅ **Monaco Editor** (VS Code Style)
- ✅ Syntax Highlighting
- ✅ **Issue Highlighting** in Code
- ✅ **Click to Navigate** to Issue Line
- ✅ **Inline Markers** with Severity Colors
- ✅ Line Selection for Comments

### 👥 Team Collaboration
- ✅ **Invite Collaborators** by Email
- ✅ **Role-based Access** (Viewer, Editor, Admin)
- ✅ **Comment System** with Line-specific Comments
- ✅ **Discussion Threads**
- ✅ Team Member Management

### 📜 Version History
- ✅ **Track Code Changes**
- ✅ **Version Descriptions**
- ✅ **Version Comparison**
- ✅ **Rollback Support**
- ✅ **Version Timeline**

### 🔀 Pull Request System
- ✅ **Create Pull Requests**
- ✅ **AI Review Before Merge**
- ✅ **Compare Versions**
- ✅ **Merge/Close PRs**
- ✅ **PR Status Tracking**

### 📊 Dashboard & Analytics
- ✅ **Total Projects** Counter
- ✅ **Bugs Detected** Counter
- ✅ **Average Code Quality** Percentage
- ✅ **Reviewed Projects** Counter
- ✅ **Bug Severity Breakdown** (High/Medium/Low)
- ✅ Recent Projects List
- ✅ Beautiful Statistics Cards

### 📄 Reports
- ✅ **Download PDF Reports**
- ✅ Professional PDF Layout
- ✅ Project Information
- ✅ Quality Score
- ✅ AI Summary
- ✅ **Bugs Table** (Line, Severity, Issue, Fix)
- ✅ Page Numbers & Footer

### 🔒 Security Features
- ✅ File Type Validation
- ✅ File Size Limits (5MB)
- ✅ JWT Token Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Protected API Routes
- ✅ Input Validation
- ✅ Comprehensive Error Handling

## 🛠️ Tech Stack

### Frontend
- **React** 18.x
- **Tailwind CSS** - Styling
- **Monaco Editor** - Code Editor
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Axios** - HTTP Client
- **jsPDF** - PDF Generation
- **React Router** - Routing

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Multer** - File Upload
- **OpenAI API** - AI Code Analysis

## 📦 Installation & Setup

### Prerequisites
- Node.js >= 14.0.0
- MongoDB installed and running
- OpenAI API Key ([Get it here](https://platform.openai.com/api-keys))

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-code-review-platform.git
cd ai-code-review-platform
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb://localhost:27017/ai-code-review
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**⚠️ IMPORTANT:** Replace `your-openai-api-key-here` with your actual OpenAI API key!

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

### 4. Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

## 🎯 Usage Guide

### 1. **Create an Account**
- Click "Sign Up"
- Enter username, email, and password
- Login with your credentials

### 2. **Create a Project**
- Go to Dashboard
- Click "New Project"
- Either:
  - **Upload a code file** (.js, .py, .cpp, etc.)
  - **Paste your code** directly
- Select programming language
- Add project name and description

### 3. **Run AI Review**
- Open your project
- Click "Run AI Review"
- Wait for AI analysis (5-15 seconds)
- View results in the sidebar

### 4. **Explore Features**
- **Review Tab**: See all detected issues
- **Comments Tab**: Add line-specific comments
- **Team Tab**: Invite collaborators
- **Versions Tab**: Track code changes
- **PRs Tab**: Create pull requests

### 5. **Download Report**
- After AI review completes
- Click "PDF" button
- Get professional PDF report

## 📁 Project Structure

```
ai-code-review-platform/
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   └── Navbar.jsx
│   │   ├── contexts/         # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   └── Profile.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
└── server/                    # Backend (Node.js/Express)
    ├── config/
    │   └── db.js             # MongoDB connection
    ├── controllers/          # Route controllers
    │   ├── authController.js
    │   ├── projectController.js
    │   ├── reviewController.js
    │   ├── statsController.js
    │   ├── collaborationController.js
    │   ├── commentController.js
    │   ├── versionController.js
    │   └── pullRequestController.js
    ├── middleware/
    │   └── authMiddleware.js # JWT verification
    ├── models/               # Mongoose models
    │   ├── User.js
    │   ├── Project.js
    │   ├── Review.js
    │   ├── Collaborator.js
    │   ├── Comment.js
    │   ├── Version.js
    │   └── PullRequest.js
    ├── routes/               # API routes
    │   ├── authRoutes.js
    │   ├── projectRoutes.js
    │   ├── reviewRoutes.js
    │   ├── statsRoutes.js
    │   ├── collaborationRoutes.js
    │   ├── commentRoutes.js
    │   ├── versionRoutes.js
    │   └── pullRequestRoutes.js
    ├── utils/
    │   └── generateToken.js  # JWT token generation
    ├── uploads/              # Uploaded files (auto-created)
    ├── .env                  # Environment variables
    ├── index.js              # Server entry point
    └── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Projects
- `POST /api/projects` - Create project (with file upload)
- `GET /api/projects` - Get all user projects
- `GET /api/projects/:id` - Get project by ID

### Reviews
- `POST /api/reviews/:projectId/analyze` - Run AI review
- `GET /api/reviews/:projectId` - Get project reviews

### Statistics
- `GET /api/stats` - Get user statistics

### Collaboration
- `POST /api/collaborators/:projectId/invite` - Invite collaborator
- `GET /api/collaborators/:projectId` - Get collaborators
- `DELETE /api/collaborators/:projectId/:collaboratorId` - Remove collaborator

### Comments
- `POST /api/comments/:projectId` - Add comment
- `GET /api/comments/:projectId` - Get comments
- `DELETE /api/comments/:commentId` - Delete comment

### Versions
- `POST /api/versions/:projectId` - Create version
- `GET /api/versions/:projectId` - Get versions
- `GET /api/versions/single/:versionId` - Get specific version
- `GET /api/versions/compare/:version1Id/:version2Id` - Compare versions

### Pull Requests
- `POST /api/pull-requests/:projectId` - Create PR
- `GET /api/pull-requests/:projectId` - Get PRs
- `POST /api/pull-requests/:prId/review` - AI review PR
- `POST /api/pull-requests/:prId/merge` - Merge PR

## 🎨 Screenshots

## Sign-up / Sign-in Page

<img width="1918" height="1033" alt="sign up" src="https://github.com/user-attachments/assets/c2f43476-1941-4e35-adcb-328958adbaae" />

<img width="1919" height="1033" alt="sign in" src="https://github.com/user-attachments/assets/3b4e4034-199b-40d2-ad4d-2765eb7c86f9" />


### Dashboard
<img width="1919" height="1029" alt="1" src="https://github.com/user-attachments/assets/3f671044-71dc-4ead-bb5a-82b812460f6b" />

<img width="1919" height="1031" alt="2" src="https://github.com/user-attachments/assets/09ae15a0-4d26-496e-a7b8-9776c5071172" />

<img width="1919" height="1030" alt="3" src="https://github.com/user-attachments/assets/7fa1713f-af87-4a71-8427-42988658080f" />

<img width="1919" height="1032" alt="dashboard" src="https://github.com/user-attachments/assets/96dd964b-83bf-4546-9438-b5fcf7a084fe" />

<img width="1919" height="1031" alt="d1" src="https://github.com/user-attachments/assets/a47be471-85c5-4119-983e-fe8c073f754b" />

<img width="1919" height="1032" alt="new porject" src="https://github.com/user-attachments/assets/661bd14d-8fa0-483b-a6a9-549fb5de9aba" />

<img width="1919" height="1029" alt="profile" src="https://github.com/user-attachments/assets/94d4a928-1213-4fc8-a222-df5dbac78fe7" />

### Code Review

<img width="1919" height="1032" alt="check code " src="https://github.com/user-attachments/assets/a49fbdae-689d-4652-bfca-13c827c0b25a" />

<img width="1918" height="1030" alt="c2" src="https://github.com/user-attachments/assets/bfb2cb37-bcc0-44b9-9eeb-950b1e51ec93" />

<img width="1919" height="1031" alt="t" src="https://github.com/user-attachments/assets/023e6169-17b1-4f06-8e80-2c7987ed3966" />

<img width="1919" height="1032" alt="h" src="https://github.com/user-attachments/assets/de56edb8-d165-4198-9d4f-35a1015a3d10" />

## Notification & Light Mood

<img width="1919" height="1032" alt="noti" src="https://github.com/user-attachments/assets/f10d16d8-c975-4e3c-9cc4-931efc0751b2" />

<img width="1919" height="1029" alt="light" src="https://github.com/user-attachments/assets/85524520-b2fb-44c5-813a-65d77a499add" />


### PDF Report

<img width="1918" height="1029" alt="r" src="https://github.com/user-attachments/assets/bcc4ec4b-baf9-4593-904d-21e598ad1095" />


## 🚀 Deployment

### Backend (Heroku/Railway)
1. Set environment variables
2. Deploy server directory
3. Ensure MongoDB connection string is correct

### Frontend (Vercel/Netlify)
1. Update API URLs to production backend
2. Deploy client directory
3. Configure build settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Monaco Editor team
- React community
- All contributors

## 📞 Support

For support, email your@email.com or create an issue in the repository.

---

**Built with ❤️ using MERN Stack + AI**
