const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
  },
  status: {
    type: DataTypes.ENUM('todo', 'in_progress', 'done'),
    defaultValue: 'todo',
    allowNull: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
    validate: {
      isDate: true,
      isAfter: {
        args: new Date().toISOString().split('T')[0],
        msg: 'Due date must be in the future'
      }
    }
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: true
  },
  estimatedHours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0.25,
      max: 999.99
    }
  },
  actualHours: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 999.99
    }
  },
  // Foreign Keys
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Projects',
      key: 'id'
    }
  },
  assignedToId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  hooks: {
    beforeUpdate: (task) => {
      // Auto-set completedAt when status changes to 'done'
      if (task.changed('status')) {
        if (task.status === 'done' && !task.completedAt) {
          task.completedAt = new Date();
        } else if (task.status !== 'done') {
          task.completedAt = null;
        }
      }
    }
  },
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['projectId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['dueDate']
    }
  ]
});

module.exports = Task;