var express = require('express');
var app = express();
const port = 8080;



var fs = require('fs');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var MongoClient = require('mongodb').MongoClient;
var db = require('./config/db');

// =======================
// configuration =========
// =======================
app.use(bodyParser.json()); // for parsing application/json

app.use(function(req, res, next) {
    //  console.log("from server.js:");
    //  console.log(req.headers);
    next();
});

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


mongoose.connect(db.url); // connect to database
//app.set('superSecret', jsonwebtoken_secret); // secret variable

// use morgan to log requests to the console
// app.use(morgan('dev'));

// set the static files location - public folder
app.use(express.static(__dirname + '/app'));

// for bower
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// for bower
app.use('/node_modules/ng-table', express.static(__dirname + '/node_modules/ng-table'));







MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err)
    require('./app/routes')(app, database);

    app.listen(port, () => { // for c9.io use  process.env.PORT || 3000, process.env.IP || "0.0.0.0"
        console.log('We are live on  ', port);
    });
});



var api_route = require('./app/routes/api_route')(app);

var Project = require('./app/models/project');