'use strict';

/* Files management */
let readFile = require('./modules/files/read');
let uploadFile = require('./modules/files/upload');
let deleteFile = require('./modules/files/delete');
let changePasswordFile = require('./modules/files/change_password');

/* User management */
let registerUser = require('./modules/users/register');
let authUser = require('./modules/users/auth');
let revokeAuthUser = require('./modules/users/auth_revoke');
let userInfo = require('./modules/users/info');
let userUploads = require('./modules/users/upload_list');

function router()
{
	ExpressApp.get('/:id/:password?', function(req, res) {
		readFile(req, res);
	});

	ExpressApp.get('/silent/:id', function(req, res) {
		readFile(req, res, true);
	});

	ExpressApp.post('/file/upload', function(req, res)	{
		uploadFile(req, res);
	});

	ExpressApp.post('/file/password/edit', function(req, res) {
		changePasswordFile(req, res);
	});

	ExpressApp.post('/file/delete', function(req, res) {
		deleteFile(req, res);
	});

	ExpressApp.post('/user/register', function(req, res) {
		registerUser(req, res);
	});

	ExpressApp.post('/user/auth', function(req, res) {
		authUser(req, res);
	});

	ExpressApp.post('/user/revoke/auth', function(req, res) {
		revokeAuthUser(req, res);
	});

	ExpressApp.get('/user/info', function(req, res) {
		userInfo(req, res);
	});

	ExpressApp.get('/user/uploads', function(req, res) {
		userUploads(req, res);
	});

	ExpressApp.get('/', function(req, res) {
		res.redirect(301, 'http://www.ushare.so');
	});
}


module.exports = router;

