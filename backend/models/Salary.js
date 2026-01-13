const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
  allowances: {
    type: Number,
    default: 0
  },
  deductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid', 'Processing'],
    default: 'Pending'
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Cash', 'Cheque']
  },
  transactionId: {
    type: String
  },
  remarks: {
    type: String
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Calculate net salary before saving
salarySchema.pre('save', function(next) {
  this.netSalary = this.basicSalary + this.allowances - this.deductions;
  next();
});

// Compound index to prevent duplicate salary records for same teacher/month/year
salarySchema.index({ teacherId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);

