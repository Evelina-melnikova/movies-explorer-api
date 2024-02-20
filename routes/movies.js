const movieRouter = require('express').Router();
// const { celebrate } = require('celebrate');

const { getMovies, createMovie, deleteMovieById } = require('../controllers/movies');
const { movieIdValidation, movieDataValidation } = require('../joi/moviesValidation');

movieRouter.get('/', getMovies);
movieRouter.post('/', movieDataValidation, createMovie);
movieRouter.delete('/:_id', movieIdValidation, deleteMovieById);

module.exports = { movieRouter };
