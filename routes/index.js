const router = require('express').Router();
const { userRouter } = require('./user');
const { movieRouter } = require('./movies');
const { createUser, login, signout } = require('../controllers/user');
const auth = require('../middlewares/auth');
const { loginValidation, registerValidation } = require('../joi/userValidation');

router.post('/signin', loginValidation, login);
router.post('/signup', registerValidation, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signout', signout);

module.exports = { router };
