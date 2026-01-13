const mongoose = require('mongoose');

const feesSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  feeType: {
    type: String,
    required: true,
    enum: ['Tuition', 'Exam', 'Library', 'Transport', 'Sports', 'Other']
  },
  amount: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Overdue', 'Partial'],
    default: 'Pending'
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Online', 'Cheque']
  },
  transactionId: {
    type: String
  },
  remarks: {
    type: String
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fees', feesSchema);

