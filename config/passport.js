var passport = require('passport');
var User = require('../app/models/user');
var config = require('./auth');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;


var localOptions = {
    usernameField: 'email'
};

var localLogin = new LocalStrategy(localOptions, function(email, password, done) {

    //console.log('local'); //for testing

    User.findOne({
        email: email
    }, function(err, user) {

        if (err) {
            return done(err);
        }

        if (!user) {
            return done(null, false, { error: 'Login failed. Please try again.' });
        }

        user.comparePassword(password, function(err, isMatch) {

            if (err) {
                return done(err);
            }

            if (!isMatch) {
                return done(null, false, { error: 'Login failed. Please try again.' });
            }

            return done(null, user);

        });

    });

});





var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('token'), //  in Angular add header:  $http.defaults.headers.common['token'] = res.data.token;
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
};



var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    console.log('passport.js:');
    console.log(payload);


    User.findById(payload._id, function(err, user) {

        if (err) {
            return done(err, false);
        }

        if (user) {
            done(null, user); // If the credentials are valid
        } else {
            done(null, false); // If the credentials are not valid
        }

    });

});

passport.use(jwtLogin);
passport.use(localLogin);