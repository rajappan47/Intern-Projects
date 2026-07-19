const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    rollNum: { 
      type: String, 
      required: [true, 'Roll number is required'], 
      unique: true,
      trim: true,
      match: [/^[a-zA-Z0-9]*$/, 'Special characters are not allowed']
    },
    name: { 
      type: String, 
      required: [true, 'Name is required'],
      trim: true,
      match: [/^[a-zA-Z\s]*$/, 'Enter only alphabets']
    },
    dept: { 
      type: String, 
      required: [true, 'Department is required'],
      trim: true,
      match: [/^[a-zA-Z\s-]*$/, 'Enter only alphabets']
    },
    status: { 
      type: String, 
      enum: ['Present', 'Absent'], 
      default: 'Present' 
    },
    // Soft Delete Implementation
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  }, 
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual id generation mapping for React application tracking
studentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});



//Replace the old pre-find middleware with this:
// studentSchema.pre(/^find/, function (next) {
//   // This will fetch documents where isDeleted is NOT true, OR where the isDeleted field does not exist yet.
//   this.find({ 
//     $or: [
//       { isDeleted: false },
//       { isDeleted: { $exists: false } }
//     ]
//   });
//   next();
// });
// Index rollNum in ascending order (Ensures fast lookup and enforces uniqueness)
studentSchema.index({ rollNum: 1 }, { unique: true });

// Compound index for search performance (speeds up queries searching by name or department)
studentSchema.index({ name: 1, dept: 1 });

module.exports = mongoose.model('Student', studentSchema);