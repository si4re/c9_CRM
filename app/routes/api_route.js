var AuthenticationController = require('../controllers/authentication_node'),
    express = require('express'),
    passportService = require('../../config/passport'),
    passport = require('passport');

var bodyParser = require('body-parser');


var requireAuth = passport.authenticate('jwt', { session: false }),
    requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {

    app.use(bodyParser.json()); // for parsing application/json

    var apiRoutes = express.Router();
    var authRoutes = express.Router();

    var ProjectRoutes = express.Router();


    // Auth Routes
    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/', function(req, res) {
        res.status(201).send("post / ok");
    });


    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    authRoutes.get('/protected', requireAuth, function(req, res) {
        res.send({ content: 'Success' });
    });

    var reqSendUser = function(req, res) {
        res.send({ content: 'user Success' });

    }

    var reqSendAdmin = function(req, res) {
        console.log(req.body);
        res.send({ content: 'admin Success' });
    }

    var middlewareFunction = function(req, res, next) {
        console.log('start middlewareFunction');

        next();
    }

    // apiRoutes.use('/555', ProjectRoutes);

    //  ProjectRoutes.put('/PO', middlewareFunction, function(req, res) {
    //     console.log(req.body);
    //  });

    //todoRoutes.get('/', middlewareFunction, requireAuth, AuthenticationController.roleAuthorization(['user']), reqSendUser);
    // todoRoutes.get('/', requireAuth, AuthenticationController.roleAuthorization(['creator', 'editor']), reqSendAdmin);



    // Set up routes
    app.use('/api', apiRoutes);





}































/*

module.exports = function(app, db, User, express, jwt, secret) {


    // API ROUTES -------------------

    // get an instance of the router for api routes
    var apiRoutes = express.Router();

    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRoutes.post('/authenticate', function(req, res) {

        // find the user
        User.findOne({
            name: req.body.name
        }, function(err, user) {

            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: 'Authentication failed. User not found.' });
            } else if (user) {

                // check if password matches
                if (user.password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                } else {

                    // if user is found and password is right
                    // create a token

                    var token = jwt.sign(user, secret.secret, {
                        expiresIn: 60 * 60 * 24
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            }
        });

    }); // end post auth



    // route middleware to verify a token /////////////////////////////////////////////////////////////////
    apiRoutes.use(function(req, res, next) {

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, secret.secret, function(err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });


    //////// end middleware

    // route to show a random message (GET http://localhost:8080/api/)
    apiRoutes.get('/', function(req, res) {
        res.json({ message: 'Welcome to the coolest API on earth!' });
    });

    // route to return all users (GET http://localhost:8080/api/users)
    apiRoutes.get('/users', function(req, res) {
        User.find({}, function(err, users) {
            res.json(users);
        });
    });


    


    // apply the routes to our application with the prefix /api
    app.use('/api', apiRoutes);




}; // end export


*/