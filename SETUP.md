# 🚀 Quick Setup Guide - AI Code Review Platform

## ⚠️ IMPORTANT: OpenAI API Key Setup

**The AI Review feature will NOT work without a valid OpenAI API key!**

### Get Your OpenAI API Key:
1. Go to: https://platform.openai.com/api-keys
2. Sign up or login
3. Click "Create new secret key"
4. Copy the key (starts with `sk-...`)
5. Add it to your `.env` file

---

## 📝 Step-by-Step Setup

### 1. Install Dependencies

#### Backend:
```bash
cd server
npm install
```

#### Frontend:
```bash
cd client
npm install
```

### 2. Configure Environment Variables

Create `server/.env` file:
```env
MONGO_URI=mongodb://localhost:27017/ai-code-review
JWT_SECRET=your_super_secret_jwt_key_12345
PORT=5000
OPENAI_API_KEY=sk-YOUR-ACTUAL-OPENAI-KEY-HERE
```

**⚠️ REPLACE `sk-YOUR-ACTUAL-OPENAI-KEY-HERE` with your real OpenAI API key!**

### 3. Start MongoDB

Make sure MongoDB is running:
```bash
# Windows (if MongoDB is installed as a service)
# It should already be running

# Or check service status:
Get-Service MongoDB
```

### 4. Start the Application

#### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

#### Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

You should see:
```
VITE v7.3.1  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 5. Access the Application

Open your browser and go to:
```
http://localhost:5173
```

---

## ✅ Testing the AI Review Feature

1. **Sign Up** for a new account
2. **Create a Project**:
   - Click "New Project"
   - Paste this sample code:
   ```javascript
   function calculateTotal(items) {
       let total = 0;
       for (let i = 0; i <= items.length; i++) {
           total += items[i].price;
       }
       return total;
   }
   ```
   - Select "JavaScript" as language
   - Click "Create Project"

3. **Run AI Review**:
   - Click "Run AI Review" button
   - Wait 5-15 seconds
   - You should see bugs detected (off-by-one error in the loop!)

4. **Download PDF**:
   - Click the "PDF" button
   - Check your downloads folder

---

## 🐛 Troubleshooting

### Problem: "AI Review failed"
**Solution:**
- Check if your OpenAI API key is correct in `.env`
- Make sure you have credits in your OpenAI account
- Check server console for error messages

### Problem: "Cannot connect to MongoDB"
**Solution:**
- Ensure MongoDB service is running
- Check if port 27017 is available
- Verify MONGO_URI in `.env`

### Problem: "Registration failed"
**Solution:**
- This was a bug we fixed earlier
- Make sure server is restarted after code changes
- Check server console for errors

### Problem: File upload not working
**Solution:**
- Check if `uploads/` folder exists in server directory
- Verify file size is under 5MB
- Check file extension is allowed (.js, .py, .cpp, etc.)

---

## 📊 All Features Checklist

After setup, you should be able to:

- ✅ Register and Login
- ✅ Create projects (upload file or paste code)
- ✅ Run AI code review
- ✅ See bugs highlighted in Monaco Editor
- ✅ Download PDF reports
- ✅ View dashboard statistics
- ✅ Edit profile
- ✅ Add comments to code
- ✅ Invite collaborators
- ✅ Create versions
- ✅ Create pull requests

---

## 🎯 Next Steps

1. **Get OpenAI API Key** (if you haven't already)
2. **Test all features** with sample code
3. **Invite friends** to test collaboration
4. **Deploy to production** (Heroku/Vercel)
5. **Add to your resume/portfolio**

---

## 💡 Pro Tips

- Use GPT-4 model for best results (already configured)
- Keep your OpenAI API key secret
- Monitor your OpenAI usage/costs
- Create meaningful project names
- Add descriptions to versions
- Use comments for team discussions

---

## 📞 Need Help?

If you're stuck:
1. Check server console for errors
2. Check browser console (F12) for errors
3. Verify all environment variables
4. Make sure MongoDB is running
5. Restart both server and client

---

**Happy Coding! 🚀**
