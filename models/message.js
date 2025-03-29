const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vote: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'Messages',
  timestamps: false,
});

module.exports = Message;
