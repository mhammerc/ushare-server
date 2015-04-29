Mongoose = require('mongoose');
ExpressApp = require('express')();
Logs = require('./modules/events_logs/models/events_logs');
 
/* --- */

Config = null;

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

var bodyParser = require('body-parser');
ExpressApp.use(bodyParser.urlencoded(
{
	extended: true
}));

var multer = require('multer');
ExpressApp.use(multer(
{
	dest: './files',
	limits: Config.fileLimits,
	rename: function(fieldname, filename, req, res)
	{
		return filename + '_' + Date.now()
	}
}));

/* --- */

var app = require('./app');

uShare.notice('Starting...');

Mongoose.connect(Config.mongoUrl);

var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', function(callback)
{
	uShare.notice(`Connected to MongoDB at ${Config.mongoUrl}`);

	app();
});

