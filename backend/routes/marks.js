const express = require('express');
const router = express.Router();
const Marks = require('../models/Marks');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/marks
// @desc    Get all marks
// @access  Private (Admin, Teacher)
router.get('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const marks = await Marks.find()
      .populate('studentId', 'name rollNo class section')
      .populate('examId', 'examName examType')
      .populate('enteredBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: marks.length,
      data: marks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/marks/student/:studentId
// @desc    Get marks for a specific student
// @access  Private
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const marks = await Marks.find({ studentId: req.params.studentId })
      .populate('examId', 'examName examType examDate')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: marks.length,
      data: marks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/marks
// @desc    Add marks
// @access  Private (Admin, Teacher)
router.post('/', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const marks = await Marks.create({
      ...req.body,
      enteredBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Marks added successfully',
      data: marks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/marks/:id
// @desc    Update marks
// @access  Private (Admin, Teacher)
router.put('/:id', protect, authorize('admin', 'teacher'), async (req, res) => {
  try {
    const marks = await Marks.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!marks) {
      return res.status(404).json({
        success: false,
        message: 'Marks record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Marks updated successfully',
      data: marks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/marks/:id
// @desc    Delete marks
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const marks = await Marks.findByIdAndDelete(req.params.id);

    if (!marks) {
      return res.status(404).json({
        success: false,
        message: 'Marks record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Marks deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

