var express = require('express');
var passport = require('passport');
var User = require('../models/User'); 
var router = express.Router();

router.get('/login', function(req, res) {
    res.render('auth/login', { user: req.user, messages: req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.get('/register', function(req, res) {
    res.render('auth/register', { user: req.user });
});

router.post('/register', async function(req, res) {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.render('auth/register', { 
                user: req.user, 
                error: 'Username or email already exists' 
            });
        }
        const user = new User({ username, email, password });
        await user.save();
        res.redirect('/auth/login');
    } catch (err) {
        res.render('auth/register', { 
            user: req.user, 
            error: 'Registration failed' 
        });
    }
});

router.get('/logout', function(req, res) {
    req.logout(function(err) {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;
