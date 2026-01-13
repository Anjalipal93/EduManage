const express = require('express');
const router = express.Router();
const Fees = require('../models/Fees');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/fees
// @desc    Get all fees records
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const fees = await Fees.find()
      .populate('studentId', 'name rollNo class section')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: fees.length,
      data: fees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/fees/student/:studentId
// @desc    Get fees for a specific student
// @access  Private
router.get('/student/:studentId', protect, async (req, res) => {
  try {
    const fees = await Fees.find({ studentId: req.params.studentId })
      .sort({ dueDate: -1 });

    // Calculate totals
    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
    const pendingAmount = totalAmount - paidAmount;

    res.status(200).json({
      success: true,
      data: fees,
      summary: {
        totalAmount,
        paidAmount,
        pendingAmount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/fees
// @desc    Create fee record
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const fee = await Fees.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Fee record created successfully',
      data: fee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/fees/:id
// @desc    Update fee record
// @access  Private (Admin)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const fee = await Fees.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fee record updated successfully',
      data: fee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/fees/:id
// @desc    Delete fee record
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const fee = await Fees.findByIdAndDelete(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Fee record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fee record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

