'use strict';

let UserSecurity = require('./models/user_security');
let Stats = require('./../stats/models/stats');

/* This controller revoke private keys */
function http(req, res)
{
	let body = req.body;

	if(!body.accountkey || !body.privatekey || !body.source)
	{
		res.status(400).sendError('You must follow the API. See docs for more informations.');
		return;
	}

	UserSecurity.verifyIdentity(body.accountkey, body.privatekey, function(err, user)
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

		UserSecurity.findOneAndUpdate(
		{ accountKey: body.accountkey, privateKey: body.privatekey },
		{ isValid: false }, function(err, success) {

			if(handleError(err))
			{
				res.serverError(err);
				return;
			}

			if(!success)
			{
				res.status(403).sendError('Your credentials are not right.')
				return;
			}

			res.sendSuccess('Your privatekey was deleted.');

			Stats.findOneAndUpdate({}, { $inc: {
				'users.auths.activated': -1,
				'users.auths.disabled': 1,
			}}).exec();
		});
	});
}

module.exports = http;