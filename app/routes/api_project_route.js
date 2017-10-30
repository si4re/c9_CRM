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
                } else {
                    console.log(result);
                    res.send({ result: result });
                }


            });


        }); //end post















        // C'R'UD   get -  list all PO
        apiRoutes.get('/PO', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res, next) {

            console.log("api_project_route.js, get - list all PO: ");

            var returnData = '_id'; // sending back data depend on user role 

            if (req.currentUserRoleFromroleAuthorizationNode == 'admin') {

                returnData = {};

            } // end if admin




            Project.find({}, returnData, function(err, result) { // important! send back only request data - for security reason

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }

                console.log(result);
                res.send(result);
            });


        }); //end post











        // CRU'D' delete PO   we use put because angular delete cant send body data
        apiRoutes.delete('/:PO', requireAuth, AuthenticationController.roleAuthorization(['admin']), function(req, res) {

            const PO = req.params.PO;
            console.log("api_project_route.js, delete PO: ", PO);

            Project.remove({
                _id: PO

            }, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }

                console.log(result);
                res.send(result);
            });

        }); //end post









        // 'C'R'U'D    get   /api/PO/detailsOrderSumm   method  get     http controller

        apiRoutes.get('/:PO/detailsOrderSumm', requireAuth, AuthenticationController.roleAuthorization(['admin']), function(req, res) {

            console.log("api_project_route.js, get detailsOrderSumm  value from /api/:PO/detailsOrderSumm: ");

            const PO = req.params.PO;

            var whatToFind = { _id: PO };

            Project.find(whatToFind, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }

                if (result.length <= 0) {
                    res.send({ error: 'array is empty' });
                } else {
                    console.log(result, null, 2); // pretty print
                    res.send(result);
                }

            });

        }); //end get



        // 'C'R'U'D     Заказ Nokia - ВК   create or update  set   /api/PO/orderVkNokia   method post        http controller

        apiRoutes.post('/PO/orderVkNokia', requireAuth, AuthenticationController.roleAuthorization(['admin']), function(req, res) {

            console.log("api_project_route.js, update /api/PO/orderVkNokia: ", req.body.project, ' ', req.body.orderNokiaVk);


            var whatToUpdate = { _id: req.body.project };
            var entry = { orderVkNokia: req.body.orderNokiaVk };

            Project.update(whatToUpdate, entry, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }


                Project.find({}, function(err, result) {
                    console.log(JSON.stringify(result, null, 2));
                });

                res.send(result);

            });

        }); //end post





        // 'C'R'U'D    Заказ АДВ - Nokia    create or update  set   /api/PO/orderADVNokia   method post        http controller

        apiRoutes.post('/PO/orderADVNokia', requireAuth, AuthenticationController.roleAuthorization(['admin']), function(req, res) {

            console.log("api_project_route.js, update /api/PO/orderADVNokia: ", req.body.project, ' ', req.body.orderADVNokia);


            var whatToUpdate = { _id: req.body.project };
            var entry = { orderADVNokia: req.body.orderADVNokia };

            Project.update(whatToUpdate, entry, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }


                Project.find({}, function(err, result) {
                    console.log(JSON.stringify(result, null, 2));
                });

                res.send(result);

            });

        }); //end post




        // 'C'R'U'D   Сумма АДВ с НДС     create or update  set   /api/PO/totalSummADV   method post        http controller

        apiRoutes.post('/PO/totalSummADV', requireAuth, AuthenticationController.roleAuthorization(['admin']), function(req, res) {

            console.log("api_project_route.js, update /api/PO/totalSummADV: ", req.body.project, ' ', req.body.totalSummADV);


            var whatToUpdate = { _id: req.body.project };
            var entry = { totalSummADV: req.body.totalSummADV };

            Project.update(whatToUpdate, entry, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }


                Project.find({}, function(err, result) {
                    console.log(JSON.stringify(result, null, 2));
                });

                res.send(result);

            });

        }); //end post








        // 'C'R'U'D   Сумма суб. подряд с НДС    create or update  set   /api/PO/totalSummADV   method post        http controller

        apiRoutes.post('/PO/totalSummSub', requireAuth, AuthenticationController.roleAuthorization(['admin']), function(req, res) {

            console.log("api_project_route.js, update /api/PO/totalSummSub: ", req.body.project, ' ', req.body.totalSummSub);


            var whatToUpdate = { _id: req.body.project };
            var entry = { totalSummSub: req.body.totalSummSub };

            Project.update(whatToUpdate, entry, function(err, result) {

                if (err) {
                    console.log(err);
                    res.send({ error: err });
                }


                Project.find({}, function(err, result) {
                    console.log(JSON.stringify(result, null, 2));
                });

                res.send(result);

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

                res.send({ status: 'OK' });

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

                res.send({ status: 'OK' });

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







        



















////////////////////////////////////////////////////////////////////////


        // CR'U'D  update /api/PO/1c/report  for 1C  -> true or false

        apiRoutes.put('/PO/1c/report', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res) {
            
                        console.log("api_project_route.js, update /api/PO/1c/report: ___________________________________________________ ");
                        console.log(req.body);
            
                        Project.findOneAndUpdate({ _id: req.body.project, 'oneC': { "$elemMatch": { 'number': req.body.oneC } } }, { $set: { 'oneC.$.report': req.body.report } }, function(err, result) {
            
                            if (err) {
                                console.log(err);
                                res.send({ error: err });
                            }
            
                            console.log(result);
                            res.send({ status: 'OK' });
                        });
            
                    }); //end post
            
            

                    // C'R'UD  read status /api/PO/1c/PNR   -> true or false
                    apiRoutes.get('/:PO/:oneC/report', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res) {
            
                        console.log("api_project_route.js, get /api/PO/1c/report: ");
                        console.log(req.params.PO, req.params.oneC);
            
                        var PO = req.params.PO;
                        var oneC = req.params.oneC;
            
            
                        var query = { _id: PO };
                        var projection = { oneC: { $elemMatch: { number: oneC } }, _id: 0, 'oneC.report': 1 };
            
            
                        Project.findOne(query, projection, function(err, result) {
            
                            if (err) {
                                console.log(err);
                                res.send({ error: err });
                            }
            
                            res.send({ PNR: result.oneC[0].report });
                        });
            
                    }); //end post

                    /////////////////////////////////////////////////////////




















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

                res.send({result: result});

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

                res.send({result: result});
                
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





        // for detail.html
    
        
// 'C'RUD create link for cloud ya disk
        apiRoutes.put('/PO/filescloud', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res) {
    
                console.log("api_project_route.js, create filename needed by ya disk: ", req.body);
    
                var whatToUpdate = {
                    _id: req.body.project
                };
    

                Project.findOneAndUpdate(whatToUpdate, { $push: { 'filescloud': { filename: req.body.filename } } }, function(err, result) {
    
                    if (err) {
                        console.log(err);
                        res.send({ error: err });
                    }
    
                    res.send({result: result});
    
                });
    
    
            }); //end put


    // CRU'D' delete filename  for cloud ya disk
    apiRoutes.put('/PO/deleteFilescloud', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res) {
    
                console.log("api_project_route.js, delete filename needed by ya disk: ", req.body);
    
                var whatToUpdate = {
                    _id: req.body.project
                };
    
                Project.findOneAndUpdate(whatToUpdate, { $pull: { 'filescloud': { filename: req.body.filename } } }, function(err, result) {
    
                    if (err) {
                        console.log(err);
                        res.send({ error: err });
                    }
    
                    res.send({result: result});
                    
                });
    
    
            }); //end delete
    
    
    
    
            // C'R'UD  read  filenames in db  for cloud ya disk
            apiRoutes.get('/filescloud/:PO', requireAuth, AuthenticationController.roleAuthorization(['admin', 'user']), function(req, res) {
    
                console.log("api_project_route.js, read filenames in db needed by ya disk: ");
    
                const PO = req.params.PO;
                   
    
                var query = { _id: PO };
                   
    
                var whatToFind = {
                    _id: PO
                };
    
               
    
                Project.findOne(whatToFind, function(err, result) {
    
                    console.log(result);

                    res.send(result);
    
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