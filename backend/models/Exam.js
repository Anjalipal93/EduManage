const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examName: {
    type: String,
    required: true
  },
  examType: {
    type: String,
    required: true,
    enum: ['Mid Term', 'End Semester', 'Unit Test', 'Final', 'Quiz']
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String
  },
  subject: {
    type: String,
    required: true
  },
  examDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  passingMarks: {
    type: Number,
    required: true
  },
  room: {
    type: String
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String
  },
  instructions: {
    type: String
  },
  syllabus: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);

