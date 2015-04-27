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

/* --- */

var app = require('./app');

Notice('Starting...');

Mongoose.connect('mongodb://localhost/ushare');

var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', function(callback) {
	Notice('Connected to MongoDB');

	app();
});

