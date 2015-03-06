register = require('./user/register');
auth = require('./user/auth/create_auth');
info = require('./user/info');
uploads = require('./user/uploads');

exports.register = register.register;
exports.auth = auth.createAuth;
exports.getInfos = info.getInfos;
exports.getUploads = uploads.getUploads;

