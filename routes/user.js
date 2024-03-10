const userRouter = require('express').Router();

const { usersMe, updateUser } = require('../controllers/user');
const { userValidation } = require('../joi/userValidation');

userRouter.get('/me', usersMe);
userRouter.patch('/me', userValidation, updateUser);

module.exports = { userRouter };
