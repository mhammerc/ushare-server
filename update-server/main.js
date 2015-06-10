'use strict';

console.log('Starting...');

global.Mongoose = require('mongoose');
global.ExpressApp = require('express')();

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
		console.log('You need at least config.json or config.default.json in order to start the '
			+ 'app.');
		process.exit();
	}
}

let app = require('./app');

/* --- */

console.log('Connecting to MongoDB.');

Mongoose.connect(Config.mongo.url);

let db = Mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', function(callback)
{
	console.log(`Connected to MongoDB at ${Config.mongo.url}`);

	app();
});