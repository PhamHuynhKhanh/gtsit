var User = require('./../models/user.model');
var crypto = require('./../utils/crypto');
var waitForYouModel = require('./../models/waitForYou.model');
var message = require('./../utils/message');
var uuid = require('uuid');
var jwt = require('./../utils/jwt');
var config = require('./../utils/message');
var configServer = require('../config');
var fs = require('fs');
var waitForYouModel = require('./../models/waitForYou.model');
module.exports = {
    getAllUser: getAllUser,
    getUserById: getUserById,
    updateUser: updateUser,
    deleteUser: deleteUser,
    uploadFile: uploadFile,
    getUserByEmail: getUserByEmail,
    createUser: createUser,
    searchUserArray: searchUserArray,
    checkUserMakedFriend: checkUserMakedFriend
}

function checkUserMakedFriend(idother, idme) {
    return new Promise((resolve, reject) => {
        waitForYouModel.findOne({ ownerID: idother }, (err, result) => {
            if (err) {
                reject(err);
            } else if (!result) {
                reject(message.ERROR_MESSAGE.USER.NOT_FOUND_USER);
            } else {
                if (result.listWaitFriend.contains(idme)) {
                    resolve({check: message.ERROR_MESSAGE.USER.USER_IS_WAITED_FRIEND});
                } else {
                    resolve({check: message.ERROR_MESSAGE.USER.USER_DO_NOT_MAKE_FRIEND});
                }
            }

        });
    })
}

function searchUserArray(request) {
    var search = {
        textSearch: request.textSearch,
        id: request.id
    }
    console.log(search.textSearch, search.id);
    return new Promise((resolve, reject) => {
        try {
            User.find({ fullname: { $regex: search.textSearch }, _id: { $not: { $eq: search.id } } }).exec((err, userModelArray) => {
                console.log(userModelArray);
                if (err) {
                    reject(message.ERROR_MESSAGE.USER.NOT_FOUND_USER);
                } else if (userModelArray) {
                    resolve(userModelArray);
                } else {
                    reject(message.STATUS_CODE.NOT_FOUND);
                }
            });
        } catch (error) {
            reject(message.STATUS_CODE.NOT_FOUND);
        }
    });
}

function uploadFile(request) {

    var id = request.id;
    var base64Data = request.base64Data;
    var typeImg = request.typeImg;
    var type = request.type;
    var nameImg = uuid.v4();
    return new Promise((resolve, reject) => {

        try {
            User.findById({ _id: id })
                .exec((err, userModel) => {

                    if (err) reject({
                        message: config.CAN_NOT_UPLOAD
                    })
                    if (!userModel) {
                        reject({
                            message: config.CAN_NOT_UPLOAD
                        });
                    } else {
                        let url;
                        if (type === '.png' || type === '.jpg' || type === '.jpeg' || type === '.JPG' || type === '.x-icon') {
                            var binaryData = new Buffer(base64Data, 'base64').toString('binary');//Read File You Send To
                            fs.writeFile('public/avatar/' + nameImg + type, binaryData, "binary", function (err) {
                                url = configServer.HTTP + configServer.DOMAIN + ':' + configServer.PORT + '/static/' + nameImg + type;
                                if (userModel.image) {
                                    var urlArr = userModel.image.split('/');

                                    var urlNeedCut = urlArr[urlArr.length - 1];
                                    fs.unlink('public/avatar/' + urlNeedCut);
                                }
                                userModel.image = url || userModel.image;
                                userModel.save();
                                resolve(url);
                            });
                        } else if (type === '.pdf') {
                            var binaryData = new Buffer(base64Data, 'base64').toString('binary');//Read File You Send To
                            fs.writeFile('public/pdf/' + nameImg + type, binaryData, "binary", function (err) {
                                url = configServer.DOMAIN + ':' + configServer.PORT + '/static/' + nameImg + type;
                                resolve(url);
                            });
                        } else {
                            var binaryData = new Buffer(base64Data, 'base64').toString('utf8');//Read File You Send To
                            fs.writeFile('public/text/' + nameImg + type, binaryData, "utf8", function (err) {
                                url = configServer.DOMAIN + ':' + configServer.PORT + '/static/' + nameImg + type;
                                resolve(url);
                            });
                        }
                    }
                });
        } catch (error) {
            reject(error);
        }
    })
}




function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        User.findOne({
            email: email
        }).exec(function (err, response) {
            if (err) {
                reject({
                    message: err.message
                });
            } else {
                resolve(response);
            }
        });
    })
}
function deleteUser(request) {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: request.id
        }).exec(function (err, response) {
            if (err) {
                reject({
                    message: err.message
                });
            } else {
                if (!response) {
                    reject({
                        statusCode: message.STATUS_CODE.NOT_FOUND,
                        message: message.ERROR_MESSAGE.USER.NOT_FOUND
                    })
                } else {
                    User.remove({
                        _id: request.id
                    }).exec(function (err, response) {
                        if (err) {
                            reject({
                                statusCode: message.STATUS_CODE.NOT_FOUND,
                                message: message.ERROR_MESSAGE.USER.NOT_FOUND
                            });
                        } else {
                            resolve({
                                statusCode: message.STATUS_CODE.SUCCES,
                                message: message.SUCCESS_MESSAGE.USER.DELETED
                            });
                        }
                    });
                }
            }
        });
    });
}
function updateUser(request) {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: request.id
        }).exec(function (err, userModel) {
            if (err) {
                reject({
                    message: message.ERROR_MESSAGE.USER.NOT_FOUND
                });
            } else {
                if (userModel) {
                    userModel.firstname = request.firstname || userModel.firstname;
                    userModel.lastname = request.lastname || userModel.lastname;
                    userModel.email = request.email || userModel.email;
                    userModel.age = request.age || userModel.age;
                    userModel.company = request.company || userModel.company;
                    userModel.slogan = request.slogan || userModel.slogan;
                    userModel.address = request.address || userModel.address;
                    userModel.sex = request.sex || userModel.sex;
                    userModel.job = request.job || userModel.job;
                    userModel.favorite = request.favorite || userModel.favorite;
                    userModel.password = request.password ? crypto.hashWithSalt(request.password, userModel.salt) : undefined || userModel.password;
                    userModel.save(function (err, response) {
                        if (err) {
                            reject({
                                message: message.ERROR_MESSAGE.USER.NOT_FOUND
                            })
                        } else {
                            jwt.sign(convertUserModelToUserResponse(response), function (err, token) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({
                                        token: token
                                    })
                                }
                            });
                        }
                    });
                } else {
                    reject({
                        statusCode: message.STATUS_CODE.NOT_FOUND,
                        message: message.ERROR_MESSAGE.USER.NOT_FOUND
                    });
                }
            }
        })
    });
}
function getUserById(id) {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: id
        }).exec(function (err, response) {
            if (err) {
                reject({
                    message: err.message
                });
            } else {
                if (!response) {
                    reject({
                        statusCode: message.STATUS_CODE.NOT_FOUND,
                        message: message.ERROR_MESSAGE.NOT_FOUND
                    });
                } else {
                    resolve(response)
                }
            }
        });
    });
}
function getAllUser() {
    return new Promise((resolve, reject) => {
        User.find({}).exec(function (err, response) {
            if (err) {
                reject(err)
            } else {
                resolve(response);
            }
        })
    });
}
function createUser(request) {
    return new Promise((resolve, reject) => {
        User.findOne({
            email: request.email
        }).exec(function (err, userModel) {
            if (err) {
                reject(err);
            } else {
                if (!userModel) {
                    var salt = crypto.genSalt();
                    var newUser = new User({
                        email: request.email,
                        password: request.password,
                        firstname: request.firstname,
                        lastname: request.lastname,
                        address: request.address,
                        companyschool: request.companyschool,
                        sex: request.sex,
                        age: request.age,
                        salt: salt,
                        favorite: request.favorite,
                        job: request.job,
                        slogan: request.slogan,
                        fullname: request.lastname + ' ' + request.firstname,
                        password: crypto.hashWithSalt(request.password, salt),
                        image: "",
                        modifiDate: new Date(),
                        createdDate: new Date(),
                        deleted: 0
                    });

                    newUser.save(function (err, response) {
                        if (err) {
                            reject(err);
                        } else {
                            var newWaitForYouModel = new waitForYouModel({
                                ownerID: response._id,
                                listWaitFriend: []
                            });
                            newWaitForYouModel.save();
                            jwt.sign(convertUserModelToUserResponse(response), function (err, token) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve({
                                        token: token
                                    })
                                }
                            })
                        }
                    });
                } else {
                    reject({
                        statusCode: message.STATUS_CODE.NOT_FOUND,
                        message: message.ERROR_MESSAGE.USER.EMAIL_EXIST
                    });
                }
            }
        });
    });
}

function convertUserModelToUserResponse(userModel) {
    var userObj = userModel.toObject();
    delete userObj.password;
    delete userObj.salt;
    delete userObj.createdDate;
    delete userObj.deleted;
    delete userObj.modifiDate;
    delete userObj.fullname;
    return userObj;
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
