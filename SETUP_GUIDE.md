# 🔧 Complete Setup Guide - EduManage

## ⚠️ Important Prerequisites

Before starting, make sure you have:
- ✅ **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- ✅ **MongoDB** - Either local or MongoDB Atlas account
- ✅ **Git** (optional)

## 🚀 Step-by-Step Setup

### Step 1: Install MongoDB

**Option A: Local MongoDB (Recommended for Development)**
1. Download from [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will start automatically on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud - Free Tier)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (M0)
3. Create a database user
4. Whitelist your IP (0.0.0.0/0 for development)
5. Get your connection string

### Step 2: Backend Setup

Open terminal in project root:

```bash
cd backend
```

**Install dependencies:**
```bash
npm install
```

**Configure Environment:**

Since `.env` file might not work, we have a `config.js` fallback. But you can try creating `.env`:

Create a file named `.env` in the `backend` folder with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edumanage
JWT_SECRET=edumanage_secret_key_2025_change_this
NODE_ENV=development
```

**For MongoDB Atlas, use:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edumanage?retryWrites=true&w=majority
```

**Start Backend:**
```bash
npm run dev
```

✅ You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
```

❌ If you see connection error:
- Make sure MongoDB is running (local)
- Check your connection string (Atlas)
- Verify port 5000 is not in use

### Step 3: Frontend Setup

**Open a NEW terminal** (keep backend running):

```bash
cd frontend
```

**Install dependencies:**
```bash
npm install
```

**Start Frontend:**
```bash
npm start
```

✅ Browser will open at `http://localhost:3000`

### Step 4: First Time Setup

1. **Register Admin Account:**
   - Click "Sign Up"
   - Fill in details:
     - Name: Admin User
     - Email: admin@edu.com
     - Password: admin123
     - Role: Admin
   - Click "Sign Up"

2. **You're in!** The dashboard will load automatically.

## 🔍 Troubleshooting

### Backend Issues

**Problem: "Cannot find module"**
```bash
cd backend
npm install
```

**Problem: "MongoDB connection error"**
- Check if MongoDB is running:
  ```bash
  # Windows (in services):
  services.msc → Look for MongoDB
  
  # Mac/Linux:
  brew services list
  ```
- Verify connection string in config.js

**Problem: "Port 5000 already in use"**
- Change PORT in config.js to 5001 or another port
- Update frontend API_URL accordingly

**Problem: "jwt malformed" or authentication errors**
- Clear browser localStorage
- Re-register or login again

### Frontend Issues

**Problem: "npm ERR! missing script: start"**
- Make sure you're in the `frontend` folder
- Run `npm install` again

**Problem: "react-scripts not found"**
```bash
npm install react-scripts --save
```

**Problem: API calls failing (Network Error)**
- Make sure backend is running on port 5000
- Check console for CORS errors
- Verify API_URL in frontend/src/config.js

**Problem: "Module not found" errors**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**Problem: Can't connect to MongoDB**

Local MongoDB:
```bash
# Check if MongoDB service is running
# Windows: Open Services, find MongoDB
# Mac: brew services list
# Start if not running
```

MongoDB Atlas:
- Verify your IP is whitelisted
- Check username/password
- Ensure connection string is correct

**Problem: Database empty or collections not created**
- Collections are created automatically when you add data
- Try registering a user first
- Check MongoDB Compass to view database

## 🎯 Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running (local or Atlas)
- [ ] Backend dependencies installed
- [ ] Backend running on port 5000
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 3000
- [ ] Can access login page
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Dashboard loads with data

## 📱 Testing the Application

### Create Test Data

**1. Register Users:**
```
Admin: admin@edu.com / admin123
Teacher: teacher@edu.com / teacher123
Student: student@edu.com / student123
```

**2. As Admin:**
- Go to Students page
- Add new students
- Create courses
- Schedule exams
- Add events

**3. As Teacher:**
- Mark attendance
- Add marks for students

**4. As Student:**
- View your attendance
- Check marks
- See timetable

## 🛠️ Development Tips

### Useful Commands

**Backend:**
```bash
# Install dependencies
npm install

# Start with auto-reload
npm run dev

# Start without auto-reload
npm start

# Clear node_modules
rm -rf node_modules && npm install
```

**Frontend:**
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Clear cache and reinstall
rm -rf node_modules package-lock.json && npm install
```

### Check Logs

**Backend Logs:**
- Terminal where backend is running
- Shows all API requests and errors

**Frontend Logs:**
- Browser Console (F12 → Console tab)
- Shows component errors and API calls

**Database:**
- Use MongoDB Compass to view data
- Connection string: `mongodb://localhost:27017`

## 🔒 Security Notes for Production

Before deploying to production:

1. **Change JWT Secret:**
   - Generate a strong random secret
   - Update in .env or config.js

2. **Update MongoDB:**
   - Use MongoDB Atlas or secure MongoDB instance
   - Use strong database password
   - Whitelist only necessary IPs

3. **Environment Variables:**
   - Never commit .env file to git
   - Use proper environment variable management

4. **CORS:**
   - Update CORS settings in backend
   - Allow only your frontend domain

## 📞 Still Having Issues?

If nothing works:

1. **Check versions:**
   ```bash
   node --version  # Should be v14+
   npm --version   # Should be 6+
   ```

2. **Clear everything and start fresh:**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   
   # Frontend
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check if ports are available:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :5000
   lsof -i :3000
   ```

4. **Restart everything:**
   - Close all terminals
   - Stop MongoDB and restart
   - Start backend first, then frontend

## ✅ Success Indicators

You know everything is working when:
- ✅ Backend shows "MongoDB Connected Successfully"
- ✅ Frontend opens in browser automatically
- ✅ Login page loads without errors
- ✅ Can register and login
- ✅ Dashboard shows (even if empty)
- ✅ No console errors in browser

---

**Need more help? Check the QUICK_START.md or README.md files!**

🎉 **Happy Coding!**

