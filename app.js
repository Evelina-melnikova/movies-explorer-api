/* eslint-disable no-console */
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const limiter = require('./middlewares/rateLimiter');
const router = require('./routes/index');
const NotFoundError = require('./utils/NotFoundError');
// const error = require('./utils/Error');

// const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = '3001', MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(helmet());

app.use(limiter);

app.use(express.json());

// app.use(requestLogger);

app.use('/', router);

app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

// app.use(errorLogger);

app.use(errors());

// app.use(error);

mongoose.connect(MONGO_URL);

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Запущен порт: ${PORT}`);
  });
});
