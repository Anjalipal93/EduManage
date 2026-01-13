const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Fees = require('../models/Fees');
const Marks = require('../models/Marks');
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

// @route   GET /api/dashboard/student/:id
// @desc    Get student dashboard data
// @access  Private
router.get('/student/:id', protect, async (req, res) => {
  try {
    const studentId = req.params.id;

    // Get attendance summary
    const attendance = await Attendance.find({ studentId });
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'Present').length;
    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    // Get fees summary
    const fees = await Fees.find({ studentId });
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidFees = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const pendingFees = totalFees - paidFees;

    // Get recent marks
    const recentMarks = await Marks.find({ studentId })
      .populate('examId', 'examName examType')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get upcoming events
    const upcomingEvents = await Event.find({
      eventDate: { $gte: new Date() },
      isActive: true
    })
      .sort({ eventDate: 1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        attendance: {
          totalDays,
          presentDays,
          absentDays: totalDays - presentDays,
          percentage: attendancePercentage
        },
        fees: {
          totalFees,
          paidFees,
          pendingFees,
          status: pendingFees === 0 ? 'Paid' : 'Pending'
        },
        recentMarks,
        upcomingEvents
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/dashboard/admin
// @desc    Get admin dashboard data
// @access  Private (Admin)
router.get('/admin', protect, async (req, res) => {
  try {
    // Get total counts
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    
    // Get fees statistics
    const allFees = await Fees.find();
    const totalFeesCollection = allFees.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const totalPending = allFees.reduce((sum, fee) => sum + (fee.amount - fee.paidAmount), 0);

    // Get attendance statistics (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await Attendance.find({ date: { $gte: today } });
    const presentToday = todayAttendance.filter(a => a.status === 'Present').length;

    // Get recent events
    const recentEvents = await Event.find({ isActive: true })
      .sort({ eventDate: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        students: totalStudents,
        teachers: totalTeachers,
        feesCollection: totalFeesCollection,
        pendingFees: totalPending,
        todayAttendance: {
          present: presentToday,
          total: todayAttendance.length
        },
        recentEvents
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

