const { body, query } = require('express-validator');

const jobCategories = ['Technology', 'Design', 'Marketing', 'Business'];

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
];

const createJobValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ max: 255 })
    .withMessage('Title cannot exceed 255 characters'),

  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 255 })
    .withMessage('Company name cannot exceed 255 characters'),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 255 })
    .withMessage('Location cannot exceed 255 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(jobCategories)
    .withMessage(`Category must be one of: ${jobCategories.join(', ')}`),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 20 })
    .withMessage('Description must be at least 20 characters'),

  body('salary_range')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Salary range cannot exceed 100 characters'),

  body('job_type')
    .optional()
    .isIn(jobTypes)
    .withMessage(`Job type must be one of: ${jobTypes.join(', ')}`),
];

const listJobsValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('category')
    .optional()
    .isIn(jobCategories)
    .withMessage('Invalid category filter'),
  query('job_type')
    .optional()
    .isIn(jobTypes)
    .withMessage('Invalid job type filter'),
];

module.exports = { createJobValidator, listJobsValidator };
