const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/attendance
// @desc    Get all attendance records
// @access  Private (Admin, Teacher)
router.get('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('studentId', 'name rollNo class section')
      .populate('markedBy', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/attendance/student/:studentId
// @desc    Get attendance for a specific student
// @access  Private
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.studentId })
      .sort({ date: -1 });

    // Calculate attendance percentage
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'Present').length;
    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: attendance,
      statistics: {
        totalDays,
        presentDays,
        absentDays: totalDays - presentDays,
        percentage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/attendance
// @desc    Mark attendance
// @access  Private (Admin, Teacher)
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const attendance = await Attendance.create({
      ...req.body,
      markedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this student on this date'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/attendance/:id
// @desc    Update attendance
// @access  Private (Admin, Teacher)
router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/attendance/:id
// @desc    Delete attendance
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

