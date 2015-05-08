'use strict';

/* WebSockets utilities */
let wsu = require('./websocket');

/* Files management */
let readFile = require('./modules/files/read');
let uploadFile = require('./modules/files/upload');
let deleteFile = require('./modules/files/delete');

/* User management */
let registerUser = require('./modules/users/register');
let authUser = require('./modules/users/auth');

function router()
{
	ExpressApp.ws('/', websocket);

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
		authUser.http(req, res);
	});

	ExpressApp.get('/user/info', function(req, res) {

	});

	ExpressApp.get('/user/uploads', function(req, res) {

	});

	ExpressApp.get('/', function(req, res) {
		res.redirect(301, 'http://usquare.io');
	});
}

function websocket(ws, req)
{
	// In order to add ws.json();
	wsu.setUpJsonResponses(ws);

	ws.on('message', function(msg) {
		msg = wsu.parseIncomingMessage(msg);
		if(!msg) return ws.json({success: false, message: 'Bad request.'});

		switch(msg.path)
		{
			case '/user/auth':
				authUser.ws(ws, msg);
				break;
			case '/user/info':
				break;
			case '/user/uploads':
				break;
		}
	});
}

module.exports = router;

