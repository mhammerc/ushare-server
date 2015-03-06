register = require('./user/register');
auth = require('./user/auth/create_auth');

exports.register = register.register;
exports.auth = auth.createAuth;

