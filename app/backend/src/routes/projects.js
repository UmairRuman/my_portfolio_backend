const express = require('express');
const router = express.Router();
const Project = require('../models/project');

// Get all projects with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};
  const total = await Project.countDocuments().exec();

  if (endIndex < total) {
    results.next = { page: page + 1, limit };
  }

  if (startIndex > 0) {
    results.previous = { page: page - 1, limit };
  }

  results.results = await Project.find()
    .limit(limit)
    .skip(startIndex)
    .exec();

  res.json(results);
});

// Add a project (for seeding)
router.post('/', async (req, res) => {
  const { title, short_description, detailed_description, images, category } = req.body;
  const project = new Project({ title,short_description, detailed_description, images, category });
  await project.save();
  res.status(201).json(project);
});

module.exports = router;