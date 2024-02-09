/* eslint-disable no-console */
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();
const { errors } = require('celebrate');
const cors = require('cors');
const limiter = require('./middlewares/rateLimiter');

const { router } = require('./routes/root');
const { NotFoundError } = require('./utils/NotFoundError');
const error = require('./utils/Error');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = '3001', MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(helmet());

app.use(limiter);

app.use(cors({
  origin: ['http://localhost:3001', 'api.evelina.nomoredomainswork.ru'],
  credentials: true,
  maxAge: 60,
}));

app.use(express.json());

app.use(requestLogger);

app.use('/', router);

app.use('*', () => {
  throw new NotFoundError({ message: 'Страница не найдена' });
});

app.use(errorLogger);

app.use(errors());

app.use(error);

mongoose.connect(MONGO_URL);

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Запущен порт: ${PORT}`);
  });
});
