var jwt = require('./../utils/jwt');
var fs = require('fs');
var path = require('path');
var userService = require('../service/user.service');
exports.auth = function () {
    return function (req, res, next) {
        var token = req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, function (err, decodedData) {
                if (err) {
                    res.json({
                        statuscode: 401,
                        message: "user invalid"
                    });
                } else {
                    var email = decodedData.email;
                    userService.getUserByEmail(email).then(function(response){
                        req.user = response;
                        next();
                    }).catch(function(err){
                        res.json({
                            statuscode: 401,
                            message: "user invalid"
                        });
                    });
                }
            });
        } else {
            res.json({
                statuscode: 401,
                message: "not exist Authorized"
            });
        }
    }
}