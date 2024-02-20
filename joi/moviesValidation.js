const { Joi, celebrate } = require('celebrate');
const { regexUrl } = require('../utils/Regex');

const movieIdValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
});

const movieDataValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regexUrl),
    trailerLink: Joi.string().required().pattern(regexUrl),
    thumbnail: Joi.string().required().pattern(regexUrl),
    owner: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports = {
  movieIdValidation,
  movieDataValidation,
};
