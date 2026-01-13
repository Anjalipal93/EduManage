# 🚀 START HERE - EduManage Quick Start

## ⚡ The Fastest Way to Run EduManage

### Prerequisites
1. ✅ **Node.js installed** → Check: Open CMD and type `node --version`
2. ✅ **MongoDB installed & running** → [Download here](https://www.mongodb.com/try/download/community)

### 🎯 Quick Start (3 Steps)

#### Step 1: Install MongoDB (if not installed)
- Download and install MongoDB Community Server
- It will start automatically after installation
- Default connection: `mongodb://localhost:27017`

#### Step 2: Start Backend
**Option A - Double Click Method (Windows):**
- Just double-click `start-backend.bat`

**Option B - Manual Method:**
```bash
cd backend
npm install
npm run dev
```

✅ Wait until you see: **"✅ MongoDB Connected Successfully"**

#### Step 3: Start Frontend (New Terminal/Window)
**Option A - Double Click Method (Windows):**
- Just double-click `start-frontend.bat`

**Option B - Manual Method:**
```bash
cd frontend
npm install
npm start
```

✅ Browser will automatically open at `http://localhost:3000`

---

## 🎉 That's It! You're Ready!

### First Time Usage:

1. **Click "Sign Up"** on the login page
2. **Register as Admin:**
   - Name: Your Name
   - Email: admin@edu.com
   - Password: admin123
   - Role: Admin
3. **Click "Sign Up"** and you'll be logged in automatically!

---

## ❌ Troubleshooting

### Issue: Backend won't start

**Check MongoDB is running:**
- Windows: Press `Win + R`, type `services.msc`, find MongoDB service
- It should be "Running"
- If not, right-click → Start

**Still not working?**
- Make sure port 5000 is not in use
- Check if you're in the correct folder
- Try: `cd backend` then `npm install` then `npm run dev`

### Issue: Frontend won't start

**Missing dependencies?**
```bash
cd frontend
npm install
npm start
```

**Port 3000 already in use?**
- The system will ask if you want to use another port
- Type "Y" and press Enter

### Issue: "Cannot connect to API"

1. **Make sure backend is running first!**
   - You should see "Server running on port 5000"
   
2. **Check both terminals are open:**
   - Terminal 1: Backend (port 5000)
   - Terminal 2: Frontend (port 3000)

### Issue: MongoDB connection error

**Local MongoDB:**
- Install MongoDB Community Server
- Make sure MongoDB service is running
- Connection string: `mongodb://localhost:27017/edumanage`

**Using MongoDB Atlas (Cloud)?**
- Get your connection string from Atlas
- Update `backend/config.js` with your connection string

---

## 📝 Quick Command Reference

### Backend Commands:
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start with auto-reload
npm start           # Start normally
```

### Frontend Commands:
```bash
cd frontend
npm install          # Install dependencies
npm start           # Start development server
npm run build       # Build for production
```

---

## ✅ Success Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running
- [ ] Backend terminal shows "MongoDB Connected"
- [ ] Backend running on port 5000
- [ ] Frontend terminal shows "Compiled successfully"
- [ ] Frontend opened in browser (port 3000)
- [ ] Can see login page without errors
- [ ] Can register and login

---

## 🎨 What Can You Do?

### As Admin (admin@edu.com):
- ➕ Add students, teachers
- 📚 Create courses
- 📅 Schedule exams & create timetables
- 💰 Manage fees
- 📊 View analytics dashboard
- 🎉 Create events

### As Teacher:
- ✅ Mark attendance
- 📝 Add exam marks
- 📖 View assigned classes
- 📅 Check timetable

### As Student:
- 📊 View attendance percentage
- 📈 Check exam results
- 💰 See fee status
- 📅 View timetable & events

---

## 📚 More Help?

- **Detailed Setup:** See `SETUP_GUIDE.md`
- **Full Documentation:** See `README.md`
- **Quick Tips:** See `QUICK_START.md`

---

## 🆘 Still Stuck?

### Common Solutions:

1. **Delete node_modules and reinstall:**
   ```bash
   # Backend
   cd backend
   rmdir /s node_modules
   npm install
   
   # Frontend
   cd frontend
   rmdir /s node_modules
   npm install
   ```

2. **Check Node.js version:**
   ```bash
   node --version   # Should be v14 or higher
   ```

3. **Clear browser cache:**
   - Press Ctrl+Shift+Delete
   - Clear cache and cookies

4. **Restart MongoDB:**
   - Open Services (services.msc)
   - Find MongoDB → Restart

---

## 🎊 Enjoy EduManage!

Once everything is running:
1. 🔐 Register your admin account
2. 👥 Add some students
3. 📚 Create courses
4. ✅ Start marking attendance
5. 📊 Enjoy the beautiful dashboards!

**Happy Managing! 🚀**

