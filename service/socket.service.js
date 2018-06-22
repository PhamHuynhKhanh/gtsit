var waitForYouModel = require('./../models/waitForYou.model');
var message = require('./../utils/message');
module.exports = {
    makeFriend: makeFriend
}
function makeFriend(request) {
    var recived = {
        sendRequestMakeFriendId: request.sendRequestMakeFriendId,
        idNeedMakeFriend: request.idNeedMakeFriend
    }

    return new Promise((resovle, reject) => {
        if (recived.sendRequestMakeFriendId && recived.idNeedMakeFriend) {
            waitForYouModel.findOne({ ownerID: recived.idNeedMakeFriend }, (err, result) => {
                if (err) {
                    reject(err);
                } else if (!result) {
                    reject(message.ERROR_MESSAGE.USER.NOT_FOUND_USER);
                } else {
                    if (result.listWaitFriend.contains(recived.sendRequestMakeFriendId)) {
                        reject(message.ERROR_MESSAGE.USER.USER_IS_WAITED_FRIEND);
                    } else {
                        result.listWaitFriend.push(recived.sendRequestMakeFriendId);
                        resovle(result.listWaitFriend);
                        result.save();
                    }
                }

            });
        }
    });
}

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}