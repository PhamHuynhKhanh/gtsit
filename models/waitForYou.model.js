const mongoose = require('mongoose');
const config = require('./../config');

var Schema = mongoose.Schema;

const waitForYouSchema = new Schema({
    ownerID: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    listWaitFriend: {
        type: []
    }
});

const waitForYou = mongoose.model('waitForYou', waitForYouSchema);

module.exports = waitForYou;