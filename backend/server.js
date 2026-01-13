const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Fallback config if .env is not available
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || config.MONGODB_URI;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/timetable', require('./routes/timetable'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/marks', require('./routes/marks'));
app.use('/api/events', require('./routes/events'));
app.use('/api/salary', require('./routes/salary'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Welcome Route
app.get('/', (req, res) => {
  res.json({ 
    message: '🎓 Welcome to EduManage API',
    version: '1.0.0',
    status: 'active'
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || config.NODE_ENV}`);
  console.log(`💡 Make sure MongoDB is running!`);
});

