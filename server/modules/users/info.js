'use strict';

let Users = require('./models/user');

function http(req, res)
{

}

function ws(ws, msg)
{
	if(!ws.userId)
	{
		ws.sendError('You must be logged before asking anything.');
		return;
	}
	
	Users.findOne(ws.userId, function(err, document)
	{
		// TODO - handle err

		if(!document)
		{
			ws.sendError('Internal error');
			return;
		}

		const response = {};

		response.username = document.username;
		response.email = document.emails[0].address;
		response.accountType = document.profile.accountType;
		response.nOfFilesSaved = document.profile.numberOfFiles;
		response.nOfViews = document.profile.numberOfViews;

		ws.json(response);
	});
}

module.exports = { http, ws };