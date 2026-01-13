const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  period: {
    type: Number,
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
  subject: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Timetable', timetableSchema);

