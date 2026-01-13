const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['Academic', 'Sports', 'Cultural', 'Holiday', 'Meeting', 'Other'],
    default: 'Academic'
  },
  eventDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String
  },
  endTime: {
    type: String
  },
  venue: {
    type: String
  },
  targetAudience: {
    type: [String],
    enum: ['All', 'Students', 'Teachers', 'Parents', 'Staff'],
    default: ['All']
  },
  organizer: {
    type: String
  },
  imageUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);

