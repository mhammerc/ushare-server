'use strict';

let Users = require('./models/user');
let UsersSecurity = require('./models/user_security');

function http(req, res)
{
	let body = req.headers;

	if(!body.accountkey || !body.privatekey || !body.source)
	{
		res.status(404).sendError('You must provide an accountkey, privatekey and the source.');
		return;
	}

	UsersSecurity.verifyIdentity(body.accountkey, body.privatekey, function(err, user) {
		
		if(handleError(err)) 
		{
			res.status(500).sendError('Internal error, please warn us with the following key : ' + err);
			return;
		}

		if(!user)
		{
			res.status(403).sendError('Your credentials are not right.');
			return;
		}

		const response = {};

		response.username = user.username;
		response.email = user.emails[0].address;
		response.accountType = user.profile.accountType;
		response.nOfFilesSaved = user.profile.numberOfFiles;
		response.nOfViews = user.profile.numberOfViews;

		res.json(response);
	});
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
		if(handleError(err))
		{
			ws.sendError('Internal error, please warn us with the following key : ' + err);
			return;
		}

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