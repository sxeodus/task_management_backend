const { Project } = require('../models');
const { validationResult } = require('express-validator');

// Get all projects for authenticated user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ where: { ownerId: req.user.id } });
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching projects', error: error.message });
  }
};

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { name, description, status, priority, color, startDate, endDate } = req.body;
    const project = await Project.create({
      name,
      description,
      status,
      priority,
      color,
      startDate,
      endDate,
      ownerId: req.user.id
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating project', error: error.message });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const project = await Project.findOne({ where: { id, ownerId: req.user.id } });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    await project.update(updates);
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating project', error: error.message });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findOne({ where: { id, ownerId: req.user.id } });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    await project.destroy();
    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting project', error: error.message });
  }
};