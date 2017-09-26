var AuthenticationController = require('../controllers/authentication_node'),
    express = require('express'),
    passportService = require('../../config/passport'),
    passport = require('passport');

var bodyParser = require('body-parser');

var requireAuth = passport.authenticate('jwt', { session: false }),
    requireLogin = passport.authenticate('local', { session: false });

// for mongoose
var Project = require('../../app/models/project');


//////////////////////////////////////////////////
module.exports = function(app) {

        app.use(bodyParser.json()); // for parsing application/json
        var apiRoutes = express.Router();







        // 'C'RUD create new PO
        apiRoutes.post('/PO', requireAuth, AuthenticationController.roleAuthorization(['admin']), function(req, res) {

            console.log("api_project_route.js, create PO: ", req.body.project);


            Project.create({
                _id: req.body.project

            }, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }

                console.log(result);
            });


        }); //end post


        // CRU'D' delete PO   we use put because angular delete cant send body data
        apiRoutes.put('/PO', requireAuth, AuthenticationController.roleAuthorization(['admin']), function(req, res) {

            console.log("api_project_route.js, delete PO: ", req.body.project);

            Project.remove({
                _id: req.body.project

            }, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }

                // console.log(result);
            });

        }); //end post



        // CR'U'D  update /api/PO/1c/CMR   -> true or false

        apiRoutes.put('/PO/1c/CMR', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res) {

            console.log("api_project_route.js, update /api/PO/1c/CMR: ");



            Project.findOneAndUpdate({ _id: req.body.project, 'oneC': { "$elemMatch": { 'number': req.body.oneC } } }, { $set: { 'oneC.$.CMR': req.body.CMR } }, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }

            });

        }); //end post



        // C'R'UD  read status /api/PO/1c/CMR   -> true or false
        apiRoutes.get('/:PO/:oneC/CMR', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res) {

            console.log("api_project_route.js, get /api/PO/1c/CMR: ");
            console.log(req.params.PO, req.params.oneC);

            var PO = req.params.PO;
            var oneC = req.params.oneC;


            var query = { _id: PO };
            var projection = { oneC: { $elemMatch: { number: oneC } }, _id: 0, 'oneC.CMR': 1 };


            Project.findOne(query, projection, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }

                res.send({ CMR: result.oneC[0].CMR });
                //console.log(result.oneC[0].CMR);
            });

        }); //end post



        // CR'U'D  update /api/PO/1c/PNR   -> true or false

        apiRoutes.put('/PO/1c/PNR', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res) {

            console.log("api_project_route.js, update /api/PO/1c/PNR: ");



            Project.findOneAndUpdate({ _id: req.body.project, 'oneC': { "$elemMatch": { 'number': req.body.oneC } } }, { $set: { 'oneC.$.PNR': req.body.PNR } }, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }

            });

        }); //end post


        // C'R'UD  read status /api/PO/1c/PNR   -> true or false
        apiRoutes.get('/:PO/:oneC/PNR', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res) {

            console.log("api_project_route.js, get /api/PO/1c/PNR: ");
            console.log(req.params.PO, req.params.oneC);

            var PO = req.params.PO;
            var oneC = req.params.oneC;


            var query = { _id: PO };
            var projection = { oneC: { $elemMatch: { number: oneC } }, _id: 0, 'oneC.PNR': 1 };


            Project.findOne(query, projection, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }

                res.send({ PNR: result.oneC[0].PNR });
                //console.log(result.oneC[0].CMR);
            });

        }); //end post



        // 'C'RUD create link for cloud ya disk
        apiRoutes.put('/PO/1c/filescloud', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res) {

            console.log("api_project_route.js, create filename needed by ya disk: ", req.body);

            var whatToUpdate = {
                _id: req.body.project,
                'oneC': {
                    "$elemMatch": {
                        'number': req.body.oneC
                    }
                }
            };

            Project.findOneAndUpdate(whatToUpdate, { $push: { 'oneC.$.filescloud': { filename: req.body.filename } } }, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }

            });


        }); //end put


        // CRU'D' delete filename  for cloud ya disk
        apiRoutes.put('/PO/1c/deleteFilescloud', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res) {

            console.log("api_project_route.js, delete filename needed by ya disk: ", req.body);

            var whatToUpdate = {
                _id: req.body.project,
                'oneC': {
                    "$elemMatch": {
                        'number': req.body.oneC
                    }
                }
            };

            Project.findOneAndUpdate(whatToUpdate, { $pull: { 'oneC.$.filescloud': { filename: req.body.filename } } }, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }

            });


        }); //end delete




        // C'R'UD  read  filenames in db  for cloud ya disk
        apiRoutes.get('/filescloud/:PO/:oneC', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res) {

            console.log("api_project_route.js, read filenames in db needed by ya disk: ");

            const PO = req.params.PO;
            const oneC = req.params.oneC;


            var query = { _id: PO };
            var projection = { oneC: { $elemMatch: { number: oneC } }, _id: 0, 'onec.filescloud.filename': 1 };


            var whatToFind = {
                _id: PO,
                'oneC': {
                    "$elemMatch": {
                        'number': oneC
                    }
                }
            };

            // Project.findOne(query, projection, function(err, result) {

            Project.findOne(whatToFind, projection, function(err, result) {

                res.send(result.oneC[0].filescloud);

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }

            });


        }); //end get




        // Set up routes
        app.use('/api', apiRoutes);

    } // end export































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