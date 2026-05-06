const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Game = sequelize.define('Game', {
  title:        { type: DataTypes.STRING(100), allowNull: false },
  genre:        { type: DataTypes.STRING(50) },
  rating:       { type: DataTypes.DECIMAL(3,1) },
  price:        { type: DataTypes.INTEGER },
  release_date: { type: DataTypes.DATEONLY },
  description:  { type: DataTypes.TEXT },
  developer:    { type: DataTypes.STRING(100) },
  image_url:    { type: DataTypes.STRING(255) },
  requirements: { type: DataTypes.JSONB }
}, { tableName: 'games', timestamps: false });

module.exports = Game;