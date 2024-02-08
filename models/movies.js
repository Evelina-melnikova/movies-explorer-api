const mongoose = require('mongoose');
const { Regex } = require('../utils/Regex');

const ERROR_MESSAGES = {
  REQUIRED: (field) => `Поле ${field} является обязательным`,
  NOT_LINK: (field) => `${field} не является ссылкой!`,
};

const linkValidator = {
  validator(v) {
    return Regex.test(v);
  },
  message: (props) => ERROR_MESSAGES.NOT_LINK(props.value),
};

const requiredValidator = (field) => ({
  required: {
    value: true,
    message: ERROR_MESSAGES.REQUIRED(field),
  },
});

const movieFields = {
  country: {
    type: String,
    ...requiredValidator('country'),
  },
  director: {
    type: String,
    ...requiredValidator('director'),
  },
  duration: {
    type: Number,
    ...requiredValidator('duration'),
  },
  year: {
    type: String,
    ...requiredValidator('year'),
  },
  description: {
    type: String,
    ...requiredValidator('description'),
  },
  image: {
    type: String,
    ...requiredValidator('image'),
    validate: linkValidator,
  },
  trailerLink: {
    type: String,
    ...requiredValidator('trailerLink'),
    validate: linkValidator,
  },
  thumbnail: {
    type: String,
    ...requiredValidator('thumbnail'),
    validate: linkValidator,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    ...requiredValidator('owner'),
  },
  movieId: {
    type: Number,
    ...requiredValidator('movieId'),
  },
  nameRU: {
    type: String,
    ...requiredValidator('nameRU'),
  },
  nameEN: {
    type: String,
    ...requiredValidator('nameEN'),
  },
};

const movieSchema = new mongoose.Schema(movieFields);

module.exports = mongoose.model('movie', movieSchema);
