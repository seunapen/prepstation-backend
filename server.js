require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./tools/logger');
const seedDatabase = require('./tools/seedRunner');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => res.json({status: 'ok', time: new Date()}));
app.get('/api/courses', async (req, res) => { const Course = require('./models/Course'); const courses = await Course.find().limit(100); res.json(courses); });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/prepstation';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    logger.info('Connected to MongoDB');
    await seedDatabase();
    app.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));
  })
  .catch(err => {
    logger.error('MongoDB connection error: ' + err.message);
    process.exit(1);
  });
