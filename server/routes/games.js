const router = require('express').Router();
const Game = require('../models/Game');
const Wishlist = require('../models/Wishlist');

router.get('/', async (req, res) => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch games', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    return res.json(game);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch game', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create game', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updatedCount] = await Game.update(req.body, { where: { id: req.params.id } });

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const updatedGame = await Game.findByPk(req.params.id);
    return res.json(updatedGame);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update game', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Wishlist.destroy({ where: { game_id: req.params.id } });
    const deletedCount = await Game.destroy({ where: { id: req.params.id } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Game not found' });
    }

    return res.json({ message: 'Game deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete game', error: error.message });
  }
});

module.exports = router;