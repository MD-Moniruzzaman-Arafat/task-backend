const express = require('express');
const router = express.Router();

const { createApplication, getAllApplications } = require('../controllers/applicationController');
const adminAuth = require('../middleware/adminAuth');
const validateRequest = require('../middleware/validateRequest');
const { createApplicationValidator } = require('../validators/applicationValidators');

// Public
router.post('/', createApplicationValidator, validateRequest, createApplication);

// Admin-only
router.get('/', adminAuth, getAllApplications);

module.exports = router;
