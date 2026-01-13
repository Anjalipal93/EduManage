const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/salary
// @desc    Get all salary records
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const salaries = await Salary.find()
      .populate('teacherId', 'name email phone')
      .populate('processedBy', 'name')
      .sort({ year: -1, month: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: salaries.length,
      data: salaries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/salary/teacher/:teacherId
// @desc    Get salary records for a specific teacher
// @access  Private (Admin, Teacher)
router.get('/teacher/:teacherId', protect, async (req, res) => {
  try {
    // Teachers can only view their own salary
    if (req.user.role === 'teacher' && req.user._id.toString() !== req.params.teacherId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this salary information'
      });
    }

    const salaries = await Salary.find({ teacherId: req.params.teacherId })
      .sort({ year: -1, month: -1 });

    // Calculate total paid
    const totalPaid = salaries
      .filter(s => s.status === 'Paid')
      .reduce((sum, s) => sum + s.netSalary, 0);

    const totalPending = salaries
      .filter(s => s.status === 'Pending')
      .reduce((sum, s) => sum + s.netSalary, 0);

    res.status(200).json({
      success: true,
      data: salaries,
      summary: {
        totalPaid,
        totalPending,
        totalRecords: salaries.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/salary
// @desc    Create salary record
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const salary = await Salary.create({
      ...req.body,
      processedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Salary record created successfully',
      data: salary
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Salary record already exists for this teacher in this month/year'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/salary/:id
// @desc    Update salary record
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const salary = await Salary.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        processedBy: req.user._id
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Salary record updated successfully',
      data: salary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/salary/:id
// @desc    Delete salary record
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const salary = await Salary.findByIdAndDelete(req.params.id);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: 'Salary record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Salary record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/salary/summary
// @desc    Get salary summary
// @access  Private (Admin)
router.get('/summary/all', protect, authorize('admin'), async (req, res) => {
  try {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const totalPaid = await Salary.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$netSalary' } } }
    ]);

    const totalPending = await Salary.aggregate([
      { $match: { status: 'Pending' } },
      { $group: { _id: null, total: { $sum: '$netSalary' } } }
    ]);

    const currentMonthSalaries = await Salary.countDocuments({
      month: currentMonth,
      year: currentYear
    });

    res.status(200).json({
      success: true,
      data: {
        totalPaid: totalPaid[0]?.total || 0,
        totalPending: totalPending[0]?.total || 0,
        currentMonthRecords: currentMonthSalaries
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

