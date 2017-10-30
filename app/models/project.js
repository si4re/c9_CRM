var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var ProjectSchema = new mongoose.Schema({
    _id: String, // номер проекта
    orderVkNokia: String, // номер заказа ВК Nokia
    orderADVNokia: String, // номер заказа Nokia АДВ
    totalSummADV: String, // сумма для АДВ
    totalSummSub: String, // сумма для подрядчика

    currentPaymentToSub: Number, // что на текущий момент оплачено подрячику
    oneC: [{
        number: Number,
        code: String,
        address: String,
        geoAddress: {
            lat: Number,
            lng: Number
        },
        report: Boolean,
        CMR: Boolean,
        PNR: Boolean,
        comments: String,
        filescloud: [{
            filename: String
                // linkToCloud: String
        }]
    }],
    filescloud: [{ // files in PO
        filename: String
    }]

}, {
    timestamps: false
});



module.exports = mongoose.model('Project', ProjectSchema);