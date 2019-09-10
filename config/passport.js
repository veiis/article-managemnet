const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const dbConfig = require('../config/database');

module.exports = (passport) => {
    passport.use(new LocalStrategy((username, password, done) => {
        let query = { email: username };
        User.findOne(query, (err, user) => {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'user not found!' });
            }
            if (password == user.password) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Wrong Password!' });
            }
        });
    }));

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}