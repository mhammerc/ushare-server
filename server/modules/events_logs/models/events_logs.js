var clc = require('cli-color');

var EventsLogs = new Mongoose.Schema(
{
	loggedAt:
	{
		type: Date,
		default: Date.now
	},
	what: Mongoose.Schema.Types.Mixed,
	category: String
});

EventsLogs.statics.log = function(what, category)
{
	var event = new this();

	event.what = what;
	event.category = category;

	event.save();
}

var Logs = Mongoose.model('EventsLogs', EventsLogs);
module.exports = Logs;

uShare = {};

function getEntry(message, content, additionalInformations)
{
	var entry = {};

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
	Logs.log(entry, level);
}

uShare.logNotice = function logNotice(message, content, additionalInformations)
{
	var entry = getEntry(message, content, additionalInformations);
	uShare.log(entry, 'notice');
}

uShare.logWarning = function logWarning(message, content, additionalInformations)
{
	var entry = getEntry(message, content, additionalInformations);
	uShare.log(entry, 'warning');
}

uShare.logError = function logError(message, content, additionalInformations)
{
	var entry = getEntry(message, content, additionalInformations);
	uShare.log(entry, 'error');
}

uShare.notice = function notice(string)
{
	console.log(clc.green(string));
	uShare.logNotice(string);
};

uShare.error = function error(string)
{
	console.log(clc.red(string));
	uShare.logError(string);
};

uShare.warn = function warn(string)
{
	console.log(clc.yellow(string));
	uShare.logWarning(string);
};