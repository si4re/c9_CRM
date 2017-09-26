var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {









    //for file upload
    var multer = require('multer');

    var upload = multer({ dest: './files/upload' }).single('file');

    //  Read 'C'RUD    upload file with parameter PO number => save paremeters in db 
    app.post('/upload', function(req, res) {
        upload(req, res, function(err) {
            if (err) {
                // An error occurred when uploading
                console.log('Error' + err);
                res.status(400).end();
            }

            const whatToUpdate = { _id: req.body.PO };
            const entry = {
                files: {
                    filename: req.file.filename,
                    originalFileName: req.file.originalname,
                    size: req.file.size
                }
            };

            var collectionName = "projects";

            db.collection(collectionName).update(whatToUpdate, { $push: entry }, (err, result) => {
                if (err) {
                    res.send({ 'error': err });
                } else {
                    res.send(result);
                    console.log(req.file);
                    res.status(200).end();
                }
            });

            // Everything went fine
            // req.file - field name of this file "file"
            // console.log(req.body.PO);
            //console.log(req.file);
            // res.send(req.file.filename);

        })
    });


    // Read C'R'UD  download file with id
    app.get('/download/:id', (req, res) => {


        function test2(value) {
            var result = value + 5;
            console.log(result);
        };

        function test1(id) {
            var value1 = id + 5;
            return value1;
        };

        // test2(test1(5));


        const id = req.params.id;

        // Callback example 
        function test3(id, callback) {
            result = id + 5;
            callback(result);
        };

        test3(5, function(result) {
            console.log(result);
        });
        // end

        var file = __dirname + './../../files/upload/' + id;
        //  res.download(file);




        getMongo(req.params.id, function(result) {
            console.log(result);
            res.download(file, result);
        });

        function downloadFile(file, originalFilename, callback) {
            callback(res.download(file, originalFilename));
        };

        function getMongo(id, callback) {

            var collectionName = "projects";
            var query = { 'files.filename': id };
            var protection = { files: { $elemMatch: { filename: id } }, _id: 0, 'files.originalFileName': 1 };

            var getQuery = db.collection(collectionName).find(query, protection).toArray(function(err, item) {
                if (err) {
                    console.log(err);
                } else {
                    callback(item[0].files[0].originalFileName); // return originalFileName 
                }
            });

        }; // end getMongo





        //  res.send(item[0].files[0].originalFileName);



    }); // end get download id


    // Read CRU'D'  download file with id
    app.delete('/download/:id', (req, res) => {
        const fs = require('fs');
        const id = req.params.id;
        var file = __dirname + './../../files/upload/' + id;

        // 1. Delete file
        // 2.  Delete noted from db


        fs.stat(file, function(err, stats) { // check if file exists
            if (err) {
                res.send(err);
                console.log(err);
            } else {

                fs.unlink(file, function() { // delete file
                    deleteFileinDb(id); // remove data from db
                });
            }
        });


        function deleteFileinDb(id) {
            var collectionName = "projects";
            db.collection(collectionName).update({}, { $pull: { files: { filename: id } } }, { multi: true }, (err, item) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send('file ' + id + ' deleted!');
                }
            });

        }; // end function

    }); // end delete file

}; // end of module.exports = function(app, db) {,