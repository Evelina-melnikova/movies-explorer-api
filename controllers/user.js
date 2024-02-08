/* eslint-disable consistent-return */
/* eslint-disable object-curly-newline */
/* eslint-disable object-property-newline */
/* eslint-disable max-len */
// eslint-disable-next-line import/no-unresolved
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('../models/user');
const HttpCodes = require('../constants/constants');
const generateToken = require('../utils/Token');

const ValidationError = require('../utils/ValidationError');
const ConflictError = require('../utils/ConflictError');
const AuthorizedError = require('../utils/AuthorizedError');
const NotFoundError = require('../utils/NotFoundError');

const UsersMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(HttpCodes.success).send(user);
  } catch (e) {
    next(e);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(
      () => new NotFoundError('Пользователь по заданному ID не найден'),
    );
    return res.status(HttpCodes.success).send(user);
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) {
      next(new ValidationError('Передан не валидный ID'));
    } else {
      next(e);
    }
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });
    res.status(HttpCodes.create).send(user);
  } catch (e) {
    if (e.code === HttpCodes.duplicate) {
      next(new ConflictError({ message: 'Пользователь уже существует' }));
    } else if (e instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Передан не валидный ID'));
    } else {
      next(e);
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updateUserProfile = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );
    return res.status(HttpCodes.success).send(updateUserProfile);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Передан не валидный ID'));
    } else {
      next(e);
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userAdmin = await User.findOne({ email }).select('+password').orFail(
      () => new AuthorizedError('Неверно введены данные'),
    );
    const matched = await bcrypt.compare(password, userAdmin.password);
    if (!matched) {
      throw new AuthorizedError('Неверно введены данные');
    }

    const token = generateToken({ _id: userAdmin._id });
    return res.status(HttpCodes.success).send(
      { name: userAdmin.name, email: userAdmin.email, id: userAdmin._id, token },
    );
  } catch (e) {
    next(e);
  }
};

const signout = async (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.status(200).send('Вы успешно вышли из системы');
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getUserById,
  createUser,
  updateUser,
  login,
  UsersMe,
  signout,
};
