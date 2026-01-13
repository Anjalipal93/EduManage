# 🚀 Quick Start Guide - EduManage

## Fast Setup (5 Minutes!)

### Step 1: Install Dependencies

Open **TWO** terminal windows in the project root directory.

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Setup MongoDB

**Option A: Local MongoDB**
- Make sure MongoDB is running on your machine
- Default connection: `mongodb://localhost:27017/edumanage`

**Option B: MongoDB Atlas (Cloud)**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get connection string
4. Update `backend/.env` file with your connection string

### Step 3: Environment Configuration

The `.env` file is already created in `backend/` folder. You can use it as is for development, or update:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edumanage
JWT_SECRET=edumanage_secret_key_2025_change_this
NODE_ENV=development
```

### Step 4: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

Browser will automatically open at `http://localhost:3000`

### Step 5: Register & Login

1. Click on "Sign Up" on the login page
2. Fill in your details:
   - Name: John Doe
   - Email: admin@edu.com
   - Password: admin123
   - Role: Admin
   - Click "Sign Up"

3. You'll be automatically logged in and redirected to the dashboard!

## 🎯 What You Can Do Now

### As Admin:
✅ Manage students (Add, Edit, Delete)  
✅ Create courses and subjects  
✅ Schedule exams  
✅ Create timetables  
✅ Manage fee records  
✅ Add events and announcements  
✅ View analytics and reports  

### As Teacher:
✅ Mark student attendance  
✅ Add exam marks  
✅ View assigned classes  
✅ Access timetable  

### As Student:
✅ View attendance records  
✅ Check exam marks  
✅ View fee status  
✅ Access timetable  
✅ See upcoming events  

## 🎨 UI Highlights

- **Beautiful Gradients**: Modern purple-blue gradient design
- **Smooth Animations**: Framer Motion powered interactions
- **Responsive Design**: Works on all screen sizes
- **Interactive Charts**: Recharts visualizations
- **Real-time Updates**: Toast notifications
- **Role-based UI**: Different views for different roles

## 📱 Test Different Roles

Create multiple accounts with different roles:

**Admin Account:**
```
Email: admin@edu.com
Password: admin123
Role: Admin
```

**Teacher Account:**
```
Email: teacher@edu.com
Password: teacher123
Role: Teacher
```

**Student Account:**
```
Name: Student Name
Email: student@edu.com
Password: student123
Role: Student
Roll No: STU001
Class: 10
Section: A
```

## 🔧 Troubleshooting

### Backend not starting?
- Check if MongoDB is running
- Verify `.env` file exists in backend folder
- Make sure port 5000 is not in use

### Frontend not starting?
- Make sure you ran `npm install` in frontend folder
- Check if port 3000 is available
- Clear browser cache

### Database connection error?
- Verify MongoDB is running
- Check MongoDB connection string in `.env`
- For MongoDB Atlas, whitelist your IP address

### API calls failing?
- Ensure backend is running on port 5000
- Check browser console for errors
- Verify JWT token in localStorage

## 🌟 Pro Tips

1. **Use DevTools**: Press F12 to open browser DevTools for debugging
2. **Check Network Tab**: Monitor API calls in Network tab
3. **Console Logs**: Backend logs show all API requests
4. **Database GUI**: Use MongoDB Compass to view database
5. **Hot Reload**: Both frontend and backend support hot reload

## 📚 Next Steps

1. ✅ Explore all pages and features
2. ✅ Add sample data (students, courses, exams)
3. ✅ Test different user roles
4. ✅ Customize the UI colors in theme settings
5. ✅ Check the detailed README.md for API documentation

## 💡 Need Help?

- Check `README.md` for detailed documentation
- Review API endpoints in backend routes
- Look at component structure in frontend/src/pages
- Examine database models in backend/models

## 🎉 You're All Set!

Start exploring EduManage and enjoy the modern school management experience!

---

**Happy Coding! 🚀**

