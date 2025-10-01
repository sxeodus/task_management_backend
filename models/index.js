const User = require('./User');
const Task = require('./Task');
const Project = require('./Project');

// User-Task Associations
User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'createdTasks',
  onDelete: 'CASCADE'
});

User.hasMany(Task, {
  foreignKey: 'assignedToId',
  as: 'assignedTasks',
  onDelete: 'SET NULL'
});

Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'creator'
});

Task.belongsTo(User, {
  foreignKey: 'assignedToId',
  as: 'assignedTo'
});

// User-Project Associations
User.hasMany(Project, {
  foreignKey: 'ownerId',
  as: 'ownedProjects',
  onDelete: 'CASCADE'
});

Project.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner'
});

// Project-Task Associations
Project.hasMany(Task, {
  foreignKey: 'projectId',
  as: 'tasks',
  onDelete: 'CASCADE'
});

Task.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project'
});

// Project Members Association (Many-to-Many)
const ProjectMember = require('../config/database').sequelize.define('ProjectMember', {
  id: {
    type: require('sequelize').DataTypes.UUID,
    defaultValue: require('sequelize').DataTypes.UUIDV4,
    primaryKey: true
  },
  role: {
    type: require('sequelize').DataTypes.ENUM('member', 'admin'),
    defaultValue: 'member'
  },
  joinedAt: {
    type: require('sequelize').DataTypes.DATE,
    defaultValue: require('sequelize').DataTypes.NOW
  }
});

User.belongsToMany(Project, {
  through: ProjectMember,
  foreignKey: 'userId',
  otherKey: 'projectId',
  as: 'memberProjects'
});

Project.belongsToMany(User, {
  through: ProjectMember,
  foreignKey: 'projectId',
  otherKey: 'userId',
  as: 'members'
});

module.exports = {
  User,
  Task,
  Project,
  ProjectMember
};