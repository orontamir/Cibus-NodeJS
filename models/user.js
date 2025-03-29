const { DataTypes } = require('sequelize');
const sequelize = require('../index').sequelize;

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userName: {
    type: DataTypes.STRING,
    field: 'name',
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Users',
  timestamps: false,
});

module.exports = User;
