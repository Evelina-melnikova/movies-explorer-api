/* eslint-disable no-shadow */
/* eslint-disable no-else-return */
const mongoose = require('mongoose');
const Movies = require('../models/movies');
const HttpCodes = require('../constants/constants');
const NotFoundError = require('../utils/NotFoundError');
const ValidationError = require('../utils/ValidationError');
const DeleteError = require('../utils/DeleteError');

module.exports.getMovies = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const movies = await Movies.find({ owner });
    res.status(HttpCodes.success).send(movies);
  } catch (e) {
    next(e);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
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

    const owner = req.user._id;
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
    const { _id } = req.params;
    await Movies.findById(_id).orFail(
      () => new NotFoundError('Фильм по заданному ID не найден'),
    )
      .then((movie) => {
        if (movie.owner._id.toString() === req.user._id.toString()) {
          return Movies.findByIdAndDelete(_id)
            .then((movie) => res.status(HttpCodes.success).send(movie));
        } else {
          return next(new DeleteError('У Вас нет прав на удаление данного фильма'));
        }
      });
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      next(new ValidationError('Передан некорректный ID'));
    } else {
      next(e);
    }
  }
};
