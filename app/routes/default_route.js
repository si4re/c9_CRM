module.exports = function(app, db) {

    // default route for index.html
    var path = require('path');

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname + '/../views/index.html')); // load the single view file (angular will handle the page changes on the front-end)
        console.log(req.headers);
    });



};