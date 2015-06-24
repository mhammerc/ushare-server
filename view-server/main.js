'use strict';

console.log('Starting...');

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
		console.log('You need at least config.json or config.default.json in order to start the '
			+ 'app.');
		process.exit();
	}
}

/* --- */

let fs = require('fs');

global.Mongoose = require('mongoose');
global.ExpressRoot = require('express')
global.Express = ExpressRoot();

global.Handlebars = require('handlebars');
global.Templates = {};
global.Templates.image = Handlebars.compile(fs.readFileSync('./templates/image.html', 'utf8'));
global.Templates.audio = Handlebars.compile(fs.readFileSync('./templates/audio.html', 'utf-8'));
global.Templates.video = Handlebars.compile(fs.readFileSync('./templates/video.html', 'utf-8'));
global.Templates.document = Handlebars.compile(fs.readFileSync('./templates/document.html', 'utf-8'));
global.Templates.download = Handlebars.compile(fs.readFileSync('./templates/download.html', 'utf-8'));

let app = require('./app');

console.log('Connecting to MongoDB...');

Mongoose.connect(Config.mongo.url);

let db = Mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', function(callback)
{
	console.log(`Connected to MongoDB at ${Config.mongo.url}`);

	app();
});