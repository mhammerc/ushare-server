var fileRead = require('./file/read');
var fileUpload = require('./file/upload');
var fileDelete = require('./file/delete');

exports.read = fileRead.read;
exports.upload = fileUpload.upload;
exports.deletef = fileDelete.deletef;

