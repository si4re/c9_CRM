module.exports = function(app, db) {


    // FOR upload data.json to payment table

    // default route for index.html
    var path = require('path');


    app.get('/data.json', function(req, res) {
        res.sendFile(path.join(__dirname + '/../../files/download/data.json')); // load the single view file (angular will handle the page changes on the front-end)

    });


};