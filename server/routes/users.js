const router = require('express').Router();
const User = require('../models/User');
const Wishlist = require('../models/Wishlist');

const toPublicUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  created_at: user.created_at,
});

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const exists = await User.findOne({ where: { email: normalizedEmail } });

    if (exists) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const createdUser = await User.create({
      username: username || `${firstName || ''} ${lastName || ''}`.trim() || normalizedEmail,
      email: normalizedEmail,
      password,
    });

    return res.status(201).json(toPublicUser(createdUser));
  } catch (error) {
    return res.status(400).json({ message: 'Failed to register user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({
      where: {
        email: email.trim().toLowerCase(),
        password,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json(toPublicUser(user));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(toPublicUser(user));
  } catch (error) {
    res.status(400).json({ message: 'Failed to create user', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updatedCount] = await User.update(req.body, { where: { id: req.params.id } });

    if (updatedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    return res.json(updatedUser);
  } catch (error) {
    return res.status(400).json({ message: 'Failed to update user', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Wishlist.destroy({ where: { user_id: req.params.id } });
    const deletedCount = await User.destroy({ where: { id: req.params.id } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

module.exports = router;