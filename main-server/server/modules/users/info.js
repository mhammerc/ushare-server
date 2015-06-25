'use strict';

let UsersSecurity = require('./models/user_security');
let Files = require('./../files/models/file');

function http(req, res)
{
	let body = req.headers;

	if(!body.accountkey || !body.privatekey || !body.source)
	{
		res.status(400).sendError('You must follow the API. See docs for more informations.');
		return;
	}

	UsersSecurity.verifyIdentity(body.accountkey, body.privatekey, function(err, user)
	{
		if(handleError(err)) 
		{
			res.serverError(err);
			return;
		}

		if(!user)
		{
			res.status(403).sendError('Your credentials are not right.');
			return;
		}

		const response = {};

		response.username = user.username;
		response.email = user.mainEmailAddress;
		response.accountType = user.profile.accountType;
		response.numberOfFilesSaved = user.profile.numberOfFiles;
		response.numberOfViews = user.profile.numberOfViews;
		response.avatarUrl = user.profile.avatarUrl;

		// Get the number of files saved today
		let todayMidnight = new Date();
		todayMidnight.setHours(0, 0, 0, 0);

		let query = Files.where('receivedAt').gte(todayMidnight);
		query.where('available').equals(true);
		query.where('author').equals(user._id);

		query.count(function(err, count)
		{
			if(handleError(err))
			{
				res.serverError(err);
				return;
			}

			response.numberOfFilesSavedToday = count;
			
			res.sendSuccess(response);
		});
	});
}

module.exports = http;
