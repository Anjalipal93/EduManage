const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    required: true
  },
  marksObtained: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number
  },
  grade: {
    type: String
  },
  remarks: {
    type: String
  },
  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Calculate percentage before saving
marksSchema.pre('save', function(next) {
  this.percentage = ((this.marksObtained / this.totalMarks) * 100).toFixed(2);
  
  // Calculate grade
  if (this.percentage >= 90) this.grade = 'A+';
  else if (this.percentage >= 80) this.grade = 'A';
  else if (this.percentage >= 70) this.grade = 'B+';
  else if (this.percentage >= 60) this.grade = 'B';
  else if (this.percentage >= 50) this.grade = 'C';
  else if (this.percentage >= 40) this.grade = 'D';
  else this.grade = 'F';
  
  next();
});

module.exports = mongoose.model('Marks', marksSchema);

