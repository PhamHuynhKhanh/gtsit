var config = require('./../config').mongodb;
var mongoose = require('mongoose');
var message = require('./../utils/message');
mongoose.Promise = global.Promise;


var connect_mongo = mongoose.connect('mongodb://' + config.host + '/' + config.database, function (err, db) {
    if(err){
        console.log(err);
    }else{
        console.log(message.SUCCESS_MESSAGE.MONGOOES.CONNECT_SUCCESS);
    }
});
module.exports = connect_mongo;