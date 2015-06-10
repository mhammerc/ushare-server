'use strict';

let User = require('./models/user');
let UserSecurity = require('./models/user_security');
let Stats = require('./../stats/models/stats');

/* This controller revoke private keys */
function http(req, res)
{
	let body = req.body;

	if(!body.accountkey || !body.privatekey || !body.source)
	{
		res.status(404).sendError('You must provide an accountkey, privatekey and the source.');
		return;
	}

	UserSecurity.verifyIdentity(body.accountkey, body.privatekey, function(err, user) {

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

		UserSecurity.findOneAndUpdate({ accountKey: body.accountkey, privateKey: body.privatekey },
			{ isValid: false }, function(err, success) {
				
				if(handleError(err))
				{
					res.serverError(err);
					return;
				}

				if(!success)
				{
					let error = new Error('Fail on updating, no document found.');
					handleError(error);
					res.serverError(error);
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

module.exports = { http };