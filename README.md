# 🎓 EduManage - School Management System

A comprehensive web-based School Management System designed to digitally manage student records, attendance, fees, courses, timetable, events, exam schedules, and marks with a modern and intuitive UI.

![EduManage Banner](https://via.placeholder.com/1200x300/6366f1/ffffff?text=EduManage+-+School+Management+System)

## ✨ Features

### 🔐 Authentication Module
- Secure login and registration system
- JWT-based authentication
- Role-based access control (Student, Teacher, Admin)
- Password encryption using bcrypt

### 👨‍🎓 Student Management
- Complete student profile management
- Course enrollment tracking
- Academic history records
- Student information CRUD operations

### 📊 Attendance Management
- Daily attendance marking by teachers
- Automatic attendance percentage calculation
- Student attendance view and history
- Real-time attendance statistics

### 💰 Fees Management (Student Fees)
- Multiple fee types (Tuition, Exam, Library, Transport, Sports)
- Fee status tracking (Paid/Pending/Overdue/Partial)
- Payment history and records
- Fee summary and analytics

### 💵 Teacher Salary Management
- Monthly salary record management
- Basic salary, allowances, and deductions tracking
- Automatic net salary calculation
- Salary status (Pending/Processing/Paid)
- Payment date and method tracking
- Teachers can view their salary history
- Admin has full control over salary disbursement

### 📚 Course Management
- Course creation and allocation
- Subject management
- Teacher assignment to courses
- Course details and syllabus

### ⏰ Timetable Management
- Class-wise timetable creation
- Period, subject, and teacher mapping
- Day-wise schedule view
- Real-time timetable updates

### 📝 Examination Module
- Multiple exam types (Mid Term, End Semester, Unit Test, Final, Quiz)
- Exam schedule management
- Subject-wise exam dates
- Exam details and instructions

### 🎯 Marks & Results
- Marks entry by teachers
- Automatic grade calculation
- Percentage computation
- Subject-wise result tracking

### 🎉 Events Management
- School event announcements
- Event types (Academic, Sports, Cultural, Holiday)
- Event scheduling with date and time
- Venue and organizer information

### 📈 Dashboard
**Student Dashboard:**
- Attendance summary with charts
- Fee status overview
- Recent exam marks
- Upcoming events and exams

**Teacher Dashboard:**
- Daily class schedule
- Quick actions (Mark attendance, Add marks)
- Student overview
- Recent activity tracking
- Salary history and payment status

**Admin Dashboard:**
- Total students and teachers count
- Fee collection analytics
- Teacher salary disbursement tracking
- Attendance statistics
- Growth charts and visualizations
- Complete financial overview

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI library
- **Material-UI (MUI)** - Component library
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt.js** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd EduManage
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already created, but you can modify)
# Update MongoDB URI and JWT Secret in .env

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will start on `http://localhost:3000`

### 4. Database Setup

The application will automatically create the database and collections when you first run it. No manual setup required!

## 🔑 Demo Credentials

### Admin Account
- Email: `admin@edu.com`
- Password: `admin123`

### Teacher Account
- Email: `teacher@edu.com`
- Password: `teacher123`

### Student Account
- Email: `student@edu.com`
- Password: `student123`

*Note: You need to create these accounts first by registering through the app.*

## 📁 Project Structure

```
EduManage/
├── backend/
│   ├── models/          # Database models
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   ├── Fees.js
│   │   ├── Course.js
│   │   ├── Timetable.js
│   │   ├── Exam.js
│   │   ├── Marks.js
│   │   └── Event.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── attendance.js
│   │   ├── fees.js
│   │   ├── courses.js
│   │   ├── timetable.js
│   │   ├── exams.js
│   │   ├── marks.js
│   │   ├── events.js
│   │   └── dashboard.js
│   ├── middleware/      # Custom middleware
│   │   └── auth.js
│   ├── server.js        # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   │   ├── Layout.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/     # React Context
│   │   │   └── AuthContext.js
│   │   ├── pages/       # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── TeacherDashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── Attendance.js
│   │   │   ├── Fees.js
│   │   │   ├── Courses.js
│   │   │   ├── Timetable.js
│   │   │   ├── Exams.js
│   │   │   ├── Marks.js
│   │   │   ├── Events.js
│   │   │   ├── Students.js
│   │   │   └── Profile.js
│   │   ├── App.js       # Main app component
│   │   ├── index.js     # Entry point
│   │   └── index.css    # Global styles
│   └── package.json
│
└── README.md
```

## 🎨 UI Features

- **Modern & Clean Design** - Beautiful gradient backgrounds and card-based layouts
- **Responsive** - Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations** - Powered by Framer Motion for delightful interactions
- **Interactive Charts** - Data visualization using Recharts
- **Toast Notifications** - Real-time feedback for user actions
- **Role-based Navigation** - Dynamic sidebar based on user role
- **Color-coded Information** - Easy-to-understand status indicators

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based authorization
- Secure HTTP headers
- Input validation

## 📊 Database Schema

### Users Collection
- Personal information (name, email, phone, address)
- Authentication details (password)
- Role (student/teacher/admin)
- Student-specific fields (rollNo, class, section)

### Salary Collection
- Teacher reference
- Month and year
- Basic salary, allowances, deductions
- Net salary (auto-calculated)
- Payment status and date
- Transaction details

### Attendance Collection
- Student reference
- Date and status
- Marked by (teacher reference)
- Remarks

### Fees Collection
- Student reference
- Fee type and amount
- Due date and payment status
- Payment details

### Courses Collection
- Course information
- Teacher assignment
- Class and section
- Academic year

### Timetable Collection
- Class and section
- Day and period
- Subject and teacher
- Time slots

### Exams Collection
- Exam details
- Date, time, and duration
- Subject and class
- Total and passing marks

### Marks Collection
- Student and exam reference
- Marks obtained and total
- Automatic grade calculation
- Percentage computation

### Events Collection
- Event details
- Date, time, and venue
- Event type and target audience
- Organizer information

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Attendance
- `GET /api/attendance` - Get all attendance
- `GET /api/attendance/student/:id` - Get student attendance
- `POST /api/attendance` - Mark attendance
- `PUT /api/attendance/:id` - Update attendance
- `DELETE /api/attendance/:id` - Delete attendance

### Similar endpoints exist for:
- Fees (`/api/fees`)
- Salary (`/api/salary`)
- Courses (`/api/courses`)
- Timetable (`/api/timetable`)
- Exams (`/api/exams`)
- Marks (`/api/marks`)
- Events (`/api/events`)
- Dashboard (`/api/dashboard`)

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend Deployment (Render)
```bash
cd backend
# Deploy to Render with MongoDB Atlas
```

### Database (MongoDB Atlas)
- Create a free cluster on MongoDB Atlas
- Update the `MONGODB_URI` in `.env` file

## 📱 Future Enhancements

- [ ] Online fee payment gateway integration
- [ ] Parent login and dashboard
- [ ] SMS/Email notifications
- [ ] Mobile app (React Native)
- [ ] AI-based performance analysis
- [ ] Automated report card generation
- [ ] Library management
- [ ] Hostel management
- [ ] Transport management
- [ ] Online examination system
- [ ] Video conferencing integration
- [ ] Push notifications
- [ ] Multi-language support
- [ ] Dark mode theme

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

Created with ❤️ for modern education management

## 🙏 Acknowledgments

- Material-UI for the amazing component library
- Framer Motion for smooth animations
- MongoDB for the flexible database
- Express.js community
- React.js community

## 📞 Support

For support, email support@edumanage.com or join our Slack channel.

---

**Made with ❤️ and ☕ - EduManage © 2024**

#   E d u M a n a g e  
 