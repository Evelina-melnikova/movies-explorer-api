const mongoose = require('mongoose');
const Movies = require('../models/movies');
const HttpCodes = require('../constants/constants');
const { NotFoundError } = require('../utils/NotFoundError');
const { ValidationError } = require('../utils/ValidationError');
const { DeleteError } = require('../utils/DeleteError');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movies.find({ owner: req.user._id });
    res.status(HttpCodes.success).send(movies);
  } catch (e) {
    next(e);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;

    const movie = await Movies.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner,
      movieId,
      nameRU,
      nameEN,
    });

    res.status(HttpCodes.create).send(movie);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Передан невалидный ID'));
    } else {
      next(e);
    }
  }
};

module.exports.deleteMovieById = async (req, res, next) => {
  try {
    const movie = await Movies.findById(req.params.id);
    if (!movie) {
      throw new NotFoundError('Фильм не найден');
    } else if (movie.owner.toString() !== req.user._id) {
      throw new DeleteError('У Вас нет прав на удаление данного фильма');
    } else {
      await Movies.deleteOne(movie);
      res.send('Фильм успешно удален');
    }
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      next(new ValidationError('Передан невалидный ID'));
    } else {
      next(e);
    }
  }
};
