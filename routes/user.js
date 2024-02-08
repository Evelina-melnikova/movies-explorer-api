const userRouter = require('express').Router();
const { updateUser, UsersMe } = require('../controllers/user');
const { userValidation } = require('../joi/userValidation');

userRouter.get('/me', UsersMe);
userRouter.patch('/me', userValidation, updateUser);

module.exports = { userRouter };
