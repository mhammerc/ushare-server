'use strict';

/* Files management */
let readFile = require('./modules/files/read');
let uploadFile = require('./modules/files/upload');
let deleteFile = require('./modules/files/delete');

/* User management */
let registerUser = require('./modules/users/register');
let authUser = require('./modules/users/auth');

function router()
{
	ExpressApp.get('/:id', function(req, res) {
		readFile(req, res);
	});

	ExpressApp.get('/silent/:id', function(req, res) {
		readFile(req, res, true);
	});

	ExpressApp.post('/file/upload', function(req, res)	{
		uploadFile(req, res);
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

	ExpressApp.get('/user/info', function(req, res) {

	});

	ExpressApp.get('/user/uploads', function(req, res) {

	});

	ExpressApp.get('/', function(req, res) {
		res.redirect(301, 'http://usquare.io');
	});
}

module.exports = router;

