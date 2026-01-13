const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/timetable
// @desc    Get all timetable entries
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { class: userClass, section } = req.query;
    
    let query = {};
    if (userClass) query.class = userClass;
    if (section) query.section = section;

    const timetable = await Timetable.find(query)
      .populate('teacher', 'name email')
      .sort({ day: 1, period: 1 });

    res.status(200).json({
      success: true,
      count: timetable.length,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/timetable/:id
// @desc    Get single timetable entry
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate('teacher', 'name email phone');

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/timetable
// @desc    Create timetable entry
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const timetable = await Timetable.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Timetable entry created successfully',
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/timetable/:id
// @desc    Update timetable entry
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Timetable updated successfully',
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/timetable/:id
// @desc    Delete timetable entry
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Timetable deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

