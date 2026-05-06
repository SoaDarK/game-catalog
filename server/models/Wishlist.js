const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Game = require('./Game');
const User = require('./User');

const Wishlist = sequelize.define('Wishlist', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  game_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Game,
      key: 'id',
    },
  },
  added_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'wishlist',
  timestamps: false,
  indexes: [
    { name: 'idx_wishlist_user_id', fields: ['user_id'] },
    { name: 'idx_wishlist_game_id', fields: ['game_id'] },
    { name: 'uq_wishlist_user_game', unique: true, fields: ['user_id', 'game_id'] },
  ],
});

Wishlist.belongsTo(User, { foreignKey: 'user_id' });
Wishlist.belongsTo(Game, { foreignKey: 'game_id' });
User.hasMany(Wishlist, { foreignKey: 'user_id' });
Game.hasMany(Wishlist, { foreignKey: 'game_id' });

module.exports = Wishlist;
