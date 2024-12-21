const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        let { email, username, password } = req.body;
    let user = new User({ email, username });
    let registeredUser = await User.register(user, password);
    req.flash('success', `Welcome ${registeredUser.username} to Wonder Lust`);
    res.redirect('/listings');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local' , {failureRedirect : '/login' , failureFlash : true}) ,async (req, res) => {
req.flash('success', 'Welcome back to Wonder Lust');
res.redirect('/listings');
});

module.exports = router;