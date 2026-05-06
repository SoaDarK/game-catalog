const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const sequelize = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', require('./routes/users'));
app.use('/api/games', require('./routes/games'));
app.use('/api/wishlist', require('./routes/wishlist'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Server error', error: error.message });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log('DB connected!');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('DB connection error:', error);
    process.exitCode = 1;
  }
};

startServer();
