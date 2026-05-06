const router = require('express').Router();
const Game = require('../models/Game');
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');

router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const wishlistItems = await Wishlist.findAll({
      where: { user_id: req.params.userId },
      include: [Game],
      order: [['added_at', 'DESC']],
    });

    return res.json(wishlistItems.map((item) => item.Game));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch wishlist', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, game_id } = req.body;

    if (!user_id || !game_id) {
      return res.status(400).json({ message: 'user_id and game_id are required' });
    }

    const user = await User.findByPk(user_id);
    const game = await Game.findByPk(game_id);

    if (!user || !game) {
      return res.status(404).json({ message: 'User or game not found' });
    }

    await Wishlist.findOrCreate({
      where: { user_id, game_id },
      defaults: { user_id, game_id },
    });

    return res.status(201).json(game);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to add wishlist item', error: error.message });
  }
});

router.delete('/:userId/:gameId', async (req, res) => {
  try {
    const deletedCount = await Wishlist.destroy({
      where: {
        user_id: req.params.userId,
        game_id: req.params.gameId,
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    return res.json({ message: 'Wishlist item deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete wishlist item', error: error.message });
  }
});

module.exports = router;
