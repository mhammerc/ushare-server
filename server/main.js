'use strict';

global.Mongoose = require('mongoose');
global.ExpressApp = require('express')();
global.Logs = require('./modules/events_logs/models/events_logs');
 
/* --- */

global.Config = null;

/* We get configurations from config.json or config.default.json */
try
{
	Config = require('./config.json');
}
catch(e)
{
	/* If config.json does not exit, we will use config.default.json */
	try
	{
		Config = require('./config.default.json');
	}
	catch(e)
	{
		uShare.error('You need at least config.json or config.default.json in order to start the '
			+ 'app.');
		process.exit();
	}
}

/* Since here, Config is available everywhere. */

/* --- */

let bodyParser = require('body-parser');
ExpressApp.use(bodyParser.urlencoded(
{
	extended: true
}));

let multer = require('multer');
ExpressApp.use(multer(
{
	dest: Config.files.destination,
	limits: Config.files.limits,

	rename: function rename(fieldname, filename, req, res)
	{
		return filename + '_' + Date.now()
	},
}));

/* --- */

let app = require('./app');

uShare.notice('Starting...');

Mongoose.connect(Config.mongo.url);

let db = Mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', function(callback)
{
	uShare.notice(`Connected to MongoDB at ${Config.mongo.url}`);

	app();
});

