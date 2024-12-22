const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/user');

//render the signup form
router.get('/signup', userController.renderNewSignupForm);
//sign up the user
router.post('/signup', wrapAsync(userController.signup));
//render the login form
router.get('/login', userController.renderLoginForm);
//log in the user
router.post('/login',saveRedirectUrl,passport.authenticate('local' , {failureRedirect : '/login' , failureFlash : true}), userController.login);
//log out the user
router.get('/logout', userController.logout);



module.exports = router;