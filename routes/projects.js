const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

const router = express.Router();

router.get('/', protect, getProjects);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;