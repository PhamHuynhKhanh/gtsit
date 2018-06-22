var socketService = require('./../service/socket.service');
var _ = require('underscore');
var jwt = require('./../utils/jwt');
var user = require('./../models/user.model');
module.exports = function (io) {
    _.each(io.nsps, function (nsp) {
        nsp.on('connect', function (socket) {
            if (!socket.auth) {
                delete nsp.connected[socket.id];
            }
        });
    });

    var chat = io.of('chat');
    chat.on('connection', authenticationChat);

    function authenticationChat(socket) {
        socket.auth = false;
        socket.on('authentication', (token) => {
            jwt.verify(token, (err, userModel) => {
                if (!err && userModel) {
                    socket.auth = true;
                    socket.user = userModel;

                    if (_.findWhere(chat.sockets, { id: socket.id }).id) {

                        chat.connected[userModel._id] = socket;
                    }
                    authenchatSuccess(chat, socket);
                } else {
                    socket.disconnect('AUTHEN_NOT_EXIST');
                }
            });
        });
    }

    function authenchatSuccess(chat, socket) {
        socket.on('make friend', (request) => {
            var recived = {
                sendRequestMakeFriendId: request.sendRequestMakeFriendId,
                idNeedMakeFriend: request.idNeedMakeFriend
            }
            var sokectIDURL = chat.connected[recived.sendRequestMakeFriendId].id;

            socketService.makeFriend(recived)
                .then(response => {
                    chat.to(sokectIDURL).emit('wait_to_accept', { result: response });
                }).catch(err => {
                    chat.to(sokectIDURL).emit('wait_to_accept', { err: err });
                });

        });
    }
}
