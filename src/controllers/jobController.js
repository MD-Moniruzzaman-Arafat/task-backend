const Job = require('../models/Job');
const Application = require('../models/Application');
const {
  sendSuccess,
  sendError,
  sendPaginated,
} = require('../middleware/response');

/**
 * GET /api/jobs
 * List all jobs with optional filtering and pagination
 */
const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      location,
      job_type,
      search,
      sort = '-created_at',
    } = req.query;

    const filter = { is_active: true };

    if (category) filter.category = category;
    if (job_type) filter.job_type = job_type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('applications'),
      Job.countDocuments(filter),
    ]);

    return sendPaginated(
      res,
      jobs,
      total,
      page,
      limit,
      'Jobs retrieved successfully'
    );
  } catch (error) {
    console.error('getAllJobs error:', error);
    return sendError(res, 'Failed to retrieve jobs', 500);
  }
};

/**
 * GET /api/jobs/:id
 * Get a single job by ID
 */
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('applications');

    if (!job) {
      return sendError(res, 'Job not found', 404);
    }

    return sendSuccess(res, job, 'Job retrieved successfully');
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid job ID format', 400);
    }
    console.error('getJobById error:', error);
    return sendError(res, 'Failed to retrieve job', 500);
  }
};

/**
 * POST /api/jobs
 * Create a new job (Admin only)
 */
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      category,
      description,
      salary_range,
      job_type,
      image,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      category,
      description,
      salary_range,
      job_type,
      image,
    });
    console.log('Job created:', job);
    return sendSuccess(res, job, 'Job created successfully', 201);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return sendError(res, 'Validation failed', 422, errors);
    }
    console.error('createJob error:', error);
    return sendError(res, 'Failed to create job', 500);
  }
};

/**
 * DELETE /api/jobs/:id
 * Delete a job and its associated applications (Admin only)
 */
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return sendError(res, 'Job not found', 404);
    }

    // Delete associated applications
    await Application.deleteMany({ job_id: req.params.id });

    await Job.findByIdAndDelete(req.params.id);

    return sendSuccess(
      res,
      null,
      'Job and associated applications deleted successfully'
    );
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid job ID format', 400);
    }
    console.error('deleteJob error:', error);
    return sendError(res, 'Failed to delete job', 500);
  }
};

/**
 * GET /api/jobs/:id/applications
 * Get all applications for a specific job (Admin only)
 */
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return sendError(res, 'Job not found', 404);
    }

    const applications = await Application.find({ job_id: req.params.id }).sort(
      '-created_at'
    );

    return sendSuccess(
      res,
      applications,
      'Applications retrieved successfully'
    );
  } catch (error) {
    if (error.name === 'CastError') {
      return sendError(res, 'Invalid job ID format', 400);
    }
    console.error('getJobApplications error:', error);
    return sendError(res, 'Failed to retrieve applications', 500);
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  deleteJob,
  getJobApplications,
};
