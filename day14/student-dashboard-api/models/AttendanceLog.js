const mongoose = require('mongoose');

const attendanceLogSchema = new mongoose.Schema({
  // The RELATIONSHIP: Reference to the Student Model
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Tells Mongoose to link this field to the 'Student' Collection
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true
  },
  remarks: {
    type: String,
    default: 'Daily routine check-in'
  }
}, { timestamps: true });

// Add a compound index to quickly find logs for a specific student sorted by date
attendanceLogSchema.index({ student: 1, date: -1 });

module.exports = mongoose.model('AttendanceLog', attendanceLogSchema);