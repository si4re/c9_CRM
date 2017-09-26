var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ProjectSchema = new mongoose.Schema({
    _id: String,
    oneC: [{
        number: Number,
        code: String,
        address: String,
        geoAddress: {
            lat: Number,
            lng: Number
        },
        reportTo1C: Boolean,
        CMR: Boolean,
        PNR: Boolean,
        comments: String,
        filescloud: [{
            filename: String
                // linkToCloud: String
        }]
    }],
    files: [{ // files in PO
        filename: String,
        originalFileName: String,
        size: Number
    }]

}, {
    timestamps: false
});



module.exports = mongoose.model('Project', ProjectSchema);