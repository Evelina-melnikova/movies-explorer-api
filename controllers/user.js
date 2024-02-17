const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const HttpCodes = require('../constants/constants');
const generateToken = require('../utils/Token');

const ValidationError = require('../utils/ValidationError');
const ConflictError = require('../utils/ConflictError');
const AuthorizedError = require('../utils/AuthorizedError');
const NotFoundError = require('../utils/NotFoundError');

const usersMe = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    res.status(HttpCodes.success).send(user);
  } catch (e) {
    if (e instanceof NotFoundError) {
      next(new NotFoundError('Пользователь не найден'));
    } else {
      next(e);
    }
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });

    res
      .status(HttpCodes.create)
      .send(user);
  } catch (e) {
    if (e.code === HttpCodes.duplicate) {
      next(new ConflictError('Пользователь уже существует'));
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
    const updateUserProfile = await User.updateUser(req.user._id, { name, email });
    res.status(HttpCodes.success).send(updateUserProfile);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) {
      next(new ValidationError('Передан невалидный ID'));
    } else {
      next(e);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new AuthorizedError('Неверный пароль');
    }

    const token = generateToken({ _id: user._id });
    console.log(token);
    res
      .cookie('jwt', token, {
        httpOnly: true,
        sameSite: false,
      })
      .send(user.toJSON());
  } catch (e) {
    next(e);
  }
};

const signout = async (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.status(HttpCodes.success).send('Вы успешно вышли из системы');
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createUser,
  updateUser,
  login,
  usersMe,
  signout,
};
