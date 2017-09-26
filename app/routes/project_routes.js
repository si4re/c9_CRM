var AuthenticationController = require('../controllers/authentication_node'),
    express = require('express'),
    passportService = require('../../config/passport'),
    passport = require('passport');

var bodyParser = require('body-parser');


var requireAuth = passport.authenticate('jwt', { session: false }),
    requireLogin = passport.authenticate('local', { session: false });



var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {

    app.use(bodyParser.json()); // for parsing application/json

    var collectionName = "projects";





    // go to PO ---> change it to /api/PO
    // Read C'R'UD
    app.get('/projects/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': id }; // old:  new ObjectID(id)
        db.collection(collectionName).findOne(details, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(item);
            }
        });
    });










    // Create 'C'RUD
    app.post('/projects', requireAuth, AuthenticationController.roleAuthorization(['admin']), (req, res) => { // middleware auth

        console.log('project_routes  555555555555555');
        console.log(req.body);

        const entry = {
            _id: req.body.project,
            oneC: [{
                number: req.body.number,
                code: req.body.code,
                address: req.body.address
            }]

        };

        db.collection(collectionName).insert(entry, (err, result) => {
            if (err) {
                res.send(err);
                // res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });



    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Update CR'U'D
    // for import from excel
    app.put('/projects/:id', (req, res) => {

        const whatToUpdate = { _id: req.params.id }; // update for PO number
        var entry; // new object for update

        // for update Geo coorditanes
        /* Send object:
        var sendObj = {   "updateGeo": true, // for reason: i have many http.put for excel fo example
                            "number": number1C,
                            "geoAddress": {
                                "lat": lat,
                                "lng": lng  }  };
        */
        if (req.body.updateGeo) { // check update geo flag
            console.log('http.put for update geo:');
            //  res.send('start');  if you don't send request, placemark will not close with "sending" status

            var update1C = { "OneC.number": parseInt(req.body.number) }; // convert to number parseInt()


            /*

            db.projects.updateMany(
                { "oneC.number": 9492397 }, 
                { "$set": { 'oneC.$.geoAddress.lng': "hello" } }
            )

            */

            //'oneC.$.geoAddress.lng': "hello"

            db.collection(collectionName).updateMany({ "oneC.number": req.body.number }, { $set: { 'oneC.$.geoAddress': { "lat": req.body.geoAddress.lat, "lng": req.body.geoAddress.lng } } }, (err, result) => { // The $set operator replaces the value of a field with the specified value.
                if (err) {
                    console.log(err); // for testing
                    res.send({ 'error': 'An error has occurred in PUT' });
                } else {
                    console.log(result.result); // for testing
                    res.send(result);
                }
            });

        } else { //     for http.put import from excel

            console.log('http.put for import from excel:');
            // get id from url params
            entry = {
                oneC: {
                    number: req.body.number,
                    code: req.body.code,
                    address: req.body.address,
                    geoAddress: req.body.geoAddress // add geo coordinates - lat lng
                }

            };
            db.collection(collectionName).update(whatToUpdate, { $push: entry }, (err, result) => {
                if (err) {
                    res.send({ 'error': 'An error has occurred in PUT' });
                } else {
                    res.send(result);
                }
            });

        } // end else

    }); // end app.PUT


    // Delete CRU'D'
    // Delete item from 1c table
    app.delete('/projects/:id', (req, res) => {
        const id = req.params.id;
        var numberID = parseInt(id); // convert string to integer

        // const details = { '_id': new ObjectID(id) };

        db.collection(collectionName).update({}, { $pull: { oneC: { number: numberID } } }, { multi: true }, (err, item) => {
            console.log(item.result);

            if (err) {
                res.send(err);
            } else {
                res.send('item ' + id + ' deleted!');
            }
        });



    }); // end app.delete



    /////////////////////////////////////////
    //  Delete CRU'D'   delete all


    app.put('/PO', (req, res) => {

        console.log(req.body);;

        const details = { "_id": req.body.numberPO };
        db.collection(collectionName).remove(details, (err, item) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send('OK');
            }
        });



    });









}; // end of module.exports = function(app, db) {