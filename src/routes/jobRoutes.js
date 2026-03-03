const express = require('express');
const router = express.Router();

const {
  getAllJobs,
  getJobById,
  createJob,
  deleteJob,
  getJobApplications,
} = require('../controllers/jobController');

const adminAuth = require('../middleware/adminAuth');
const validateRequest = require('../middleware/validateRequest');
const { createJobValidator, listJobsValidator } = require('../validators/jobValidators');

// Public routes
router.get('/', listJobsValidator, validateRequest, getAllJobs);
router.get('/:id', getJobById);

// Admin-only routes
router.post('/', adminAuth, createJobValidator, validateRequest, createJob);
router.delete('/:id', adminAuth, deleteJob);
router.get('/:id/applications', adminAuth, getJobApplications);

module.exports = router;
