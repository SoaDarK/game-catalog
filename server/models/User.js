const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  username:   { type: DataTypes.STRING(50), allowNull: false },
  email:      { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password:   { type: DataTypes.STRING(255), allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'users', timestamps: false });

module.exports = User;