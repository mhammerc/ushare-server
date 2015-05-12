'use strict';

let clc = require('cli-color');

let EventsLogs = new Mongoose.Schema(
{
	loggedAt:
	{
		type: Date,
		default: Date.now,
	},
	what: Mongoose.Schema.Types.Mixed,
	category: String,
});

EventsLogs.statics.log = function(what, category)
{
	let event = new this();
	let date = Date.now();

	event.what = what;
	event.category = category;
	event.loggedAt = date;

	event.save();

	return date;
}

let Logs = Mongoose.model('EventsLogs', EventsLogs);

module.exports = Logs;

global.uShare = {};

function getEntry(message, content, additionalInformations)
{
	let entry = {};

	if(message)
	{
		entry.message = message;
	}

	if(content)
	{
		entry.content = content;
	}

	if(additionalInformations)
	{
		entry.additionalInformations = additionalInformations;
	}

	return entry;
}

uShare.log = function log(entry, level)
{
	return Logs.log(entry, level);
}

uShare.logNotice = function logNotice(message, content, additionalInformations)
{
	let entry = getEntry(message, content, additionalInformations);
	return uShare.log(entry, 'notice');
}

uShare.logWarning = function logWarning(message, content, additionalInformations)
{
	let entry = getEntry(message, content, additionalInformations);
	return uShare.log(entry, 'warning');
}

uShare.logError = function logError(message, content, additionalInformations)
{
	let entry = getEntry(message, content, additionalInformations);
	return uShare.log(entry, 'error');
}

uShare.notice = function notice(string)
{
	console.log(clc.green(string));
	return uShare.logNotice(string);
};

uShare.error = function error(string)
{
	console.log(clc.red(string));
	return uShare.logError(string);
};

uShare.warn = function warn(string)
{
	console.log(clc.yellow(string));
	return uShare.logWarning(string);
};


/* On callbacks with always have an err argument.
 * Pass the err argument to it, say what you are doing and eventually give more infos.
 * Then verify if the handle error return true. If it is, there is an error.
 */	
global.handleError = function handleError(err, infos)
{
	if(!err) return false;

	err = uShare.logError(null, err, infos);
	return err;
}