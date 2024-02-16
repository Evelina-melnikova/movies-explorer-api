const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { AuthorizedError } = require('../utils/AuthorizedError');

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Неправильные почта или пароль',
};

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 30;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Эвелина',
      minlength: [NAME_MIN_LENGTH, `Минимальная длина ${NAME_MIN_LENGTH} символа`],
      maxlength: [NAME_MAX_LENGTH, `Максимальная длина ${NAME_MAX_LENGTH} символов`],
    },
    email: {
      type: String,
      required: [true, 'Поле email является обязательным'],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Некорректный формат email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле password является обязательным'],
      select: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        const { password, ...userWithoutPassword } = ret;
        return userWithoutPassword;
      },
    },
  },
);

userSchema.statics.findUserByEmail = async function (email) {
  return this.findOne({ email });
};

userSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error('Ошибка сравнения пароля:', error);
    throw new AuthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
  }
};

userSchema.statics.authenticate = async function (email, password) {
  const user = await this.findUserByEmail(email);
  if (!user) {
    throw new AuthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
  }
  const passwordMatched = await user.comparePassword(password);
  if (!passwordMatched) {
    throw new AuthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
  }
  return user;
};

module.exports = mongoose.model('user', userSchema);
