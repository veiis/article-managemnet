const express = require('express');
const router = express.Router();
const passport = require('passport');
let User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let phone_number = req.body.phone_number;
    let password = req.body.password;

    req.checkBody('name', 'Name is required!').notEmpty();
    req.checkBody('email', 'Email is required!').notEmpty();
    req.checkBody('phone_number', 'Phone Number is required!').notEmpty();
    req.checkBody('password', 'Password is required!').notEmpty();
    req.checkBody('conf_password', 'Passwords does not match').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors
        })
    } else {
        let newUser = new User({
            name,
            email,
            phone_number,
            password
        });

        newUser.save((err) => {
            if (err) {
                req.flash('danger', 'User Does not saved!');
                return;
            } else {
                req.flash('success', 'User Saved Successfuly!');
                res.redirect('/users/login');
            }
        })
    }
});


router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', { 
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are out!');
    res.redirect('/users/login');
});

module.exports = router;