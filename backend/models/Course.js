const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true
  },
  courseCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  credits: {
    type: Number,
    default: 3
  },
  duration: {
    type: String
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String
  },
  syllabus: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);

