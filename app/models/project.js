var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ProjectSchema = new mongoose.Schema({
    _id: String, // номер проекта
    orderVkNokia: String, // номер заказа ВК Nokia

    orderADVNokia: Number, // номер заказа Nokia АДВ
    totalSummADV: Number, // сумма для АДВ
    totalSummSub: Number, // сумма для подрядчика
    currentPaymentToSub: Number, // что на текущий момент оплачено подрячику
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