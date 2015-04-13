var colors = require("colors");
Mongoose = require('mongoose');
ExpressApp = require('express')();

var app = require('./app');

console.log('Starting...'.green);

Mongoose.connect('mongodb://localhost/ushare');

var db = Mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', function(callback) {
	console.log('Connected to MongoDB'.green);

	app();
});

