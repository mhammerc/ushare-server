Mongoose = require('mongoose');
ExpressApp = require('express')();

var clc = require('cli-color');

Notice = function(string)
{
	console.log(clc.green(string));
};

Error = function(string)
{
	console.log(clc.red(string));
};

Warn = function(string)
{
	console.log(clc.yellow(string));
};

var multer = require('multer');
ExpressApp.use(multer(
{
	dest: './files',
	//limits: ??,
	rename: function(fieldname, filename, req, res)
	{
		return filename + '_' + Date.now()
	}
}));

//var bodyParser = require('body-parser');
/*ExpressApp.use(bodyParser.urlencoded(
{
	extended: false
}));*/

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
		Error('You need at least config.json or config.default.json in order to start the app.');
		process.exit();
	}
}

/* Since here, Config is available everywhere. */

/* --- */

var app = require('./app');

Notice('Starting...');

Mongoose.connect('mongodb://localhost/ushare');

var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', function(callback)
{
	Notice('Connected to MongoDB');

	app();
});

