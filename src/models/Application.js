const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Applicant name is required'],
      trim: true,
      maxlength: [255, 'Name cannot exceed 255 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    resume_link: {
      type: String,
      required: [true, 'Resume link is required'],
      trim: true,
      match: [
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,
        'Please provide a valid URL for the resume link',
      ],
    },
    cover_note: {
      type: String,
      trim: true,
      maxlength: [2000, 'Cover note cannot exceed 2000 characters'],
      default: '',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate applications (same email + job)
applicationSchema.index({ job_id: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
