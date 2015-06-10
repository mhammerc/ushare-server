File = new Mongo.Collection('files');

getOwnFiles = function getOwnFiles(options) {
	
	if(!Meteor.user()) return false;

	if(!options) options = {};

	return File.find({ author: Meteor.userId() }, options);
}