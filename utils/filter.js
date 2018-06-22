var path = require('path');
var _ = require('lodash');

module.exports = {
    getFormatFormFileName: getFormatFormFileName
}

function getFormatFormFileName(fileName) {
    return (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;
}