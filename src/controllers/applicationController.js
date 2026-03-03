const Application = require('../models/Application');
const Job = require('../models/Job');
const { sendSuccess, sendError } = require('../middleware/response');

/**
 * POST /api/applications
 * Submit a job application
 */
const createApplication = async (req, res) => {
  try {
    const { job_id, name, email, resume_link, cover_note } = req.body;

    // Verify the job exists and is active
    const job = await Job.findById(job_id);
    if (!job) {
      return sendError(res, 'Job not found', 404);
    }
    if (!job.is_active) {
      return sendError(res, 'This job posting is no longer active', 400);
    }

    const application = await Application.create({
      job_id,
      name,
      email,
      resume_link,
      cover_note,
    });

    const populated = await application.populate('job_id', 'title company location');

    return sendSuccess(res, populated, 'Application submitted successfully', 201);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 'You have already applied to this job with this email address', 409);
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return sendError(res, 'Validation failed', 422, errors);
    }
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid job ID format', 400);
    }
    console.error('createApplication error:', error);
    return sendError(res, 'Failed to submit application', 500);
  }
};

/**
 * GET /api/applications
 * List all applications (Admin only)
 */
const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20, job_id } = req.query;
    const filter = job_id ? { job_id } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .populate('job_id', 'title company location')
        .sort('-created_at')
        .skip(skip)
        .limit(parseInt(limit)),
      Application.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Applications retrieved successfully',
      data: applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('getAllApplications error:', error);
    return sendError(res, 'Failed to retrieve applications', 500);
  }
};

module.exports = { createApplication, getAllApplications };
