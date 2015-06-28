'use strict';

let User = require('./models/user');
let UserSecurity = require('./models/user_security');
let Stats = require('./../stats/models/stats');

/* This controller generate and return a private key. */
function http(req, res)
{
	let body = req.body;

	if(!body.username || !body.password || !body.source)
	{
		res.status(400).sendError('You must follow the API. See docs for more informations.');
		return;
	}

	User.getUser(body.username, body.password, function(err, user)
	{
		if(handleError(err))
		{
			res.serverError(err);
		}

		if(!user)
		{
			res.status(403).sendError('Your credentials are not right.');
			return;
		}

		let auth = new UserSecurity();
		auth.privateKey = auth.generateNewPrivateKey();
		auth.accountKey = user._id;
		auth.ipv4 = req.get('X-Real-Ip');
		auth.source = body.source;

		auth.save(function(err)
		{
			if(handleError(err))
			{
				res.serverError(err);
				return;
			}

			res.sendSuccess({ accountkey: user._id, privatekey: auth.privateKey });

			Stats.findOne(function(err, document) 
			{
				if(handleError(err)) return;

				++document.users.auths.activated;
				++document.users.auths.total;

				document.save(function(err){ handleError(err); });
			});
		});
	});
}


module.exports = http;