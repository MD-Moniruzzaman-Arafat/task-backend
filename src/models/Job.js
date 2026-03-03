const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [255, 'Title cannot exceed 255 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [255, 'Company name cannot exceed 255 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [255, 'Location cannot exceed 255 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: ['Technology', 'Design', 'Marketing', 'Business'],
        message: '{VALUE} is not a valid category',
      },
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    salary_range: {
      type: String,
      trim: true,
      default: null,
    },
    job_type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
      default: 'Full-time',
    },

    // 🖼 Image Upload Field
    image: {
      url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
        default: null,
      },
    },

    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: total applications count
jobSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'job_id',
  count: true,
});

// Indexes
jobSchema.index({ category: 1, location: 1 });
jobSchema.index({ created_at: -1 });

module.exports = mongoose.model('Job', jobSchema);
