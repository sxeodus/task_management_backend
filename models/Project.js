const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'archived', 'on_hold'),
    defaultValue: 'active',
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
    allowNull: false
  },
  color: {
    type: DataTypes.STRING(7), // For hex color codes like #FF5733
    defaultValue: '#3B82F6',
    allowNull: false,
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: true
    }
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: true,
      isAfterStartDate(value) {
        if (value && this.startDate && value <= this.startDate) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  },
  // Foreign Keys
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  hooks: {
    beforeUpdate: (project) => {
      // Auto-set completedAt when status changes to 'completed'
      if (project.changed('status')) {
        if (project.status === 'completed' && !project.completedAt) {
          project.completedAt = new Date();
          project.progress = 100;
        } else if (project.status !== 'completed') {
          project.completedAt = null;
        }
      }
    }
  },
  indexes: [
    {
      fields: ['ownerId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    }
  ]
});

module.exports = Project;