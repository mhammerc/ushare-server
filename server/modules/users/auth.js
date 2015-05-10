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
		res.sendError('You need to pass a valid username, password and a valid source name');
		return;
	}

	User.getUser(body.username, body.password, function(err, user)
	{
		if(handleError(err))
		{
			res.status(500).sendError(`Internal error. Please warn us with the following key: ${err}`);
			return;
		}

		if(!user)
		{
			res.sendError('Your credentials are not right.');
			return;
		}

		let auth = new UserSecurity();
		auth.privateKey = auth.generateNewPrivateKey();
		auth.accountKey = user._id;
		auth.ipv4 = req.ip;
		auth.source = body.source;

		auth.save(function(err)
		{
			if(handleError(err))
			{
				res.status(500).sendError(`Internal error. Please warn us with the following key: ${err}`);
				return;
			}

			uShare.logNotice('New private key generated.', {}, {ip:req.ip, user:user._id, 
				privateKey: auth.privateKey});

			res.json({accountKey:user._id, privateKey:auth.privateKey});

			Stats.findOne(function(err, document) {
				if(handleError(err)) return;

				++document.users.auths.activated;
				++document.users.auths.total;

				document.save(function(err){ handleError(err); });
			});
		});
	});
}

function ws(ws, msg)
{
	if(!msg.username || !msg.password || !msg.source)
	{
		ws.sendError('Your request isn\'t following the API.');
		return;
	}

	User.getUser(msg.username, msg.password, function(err, user)
	{
		if(handleError(err))
		{
			ws.sendError('Internal error.');
			return;
		}

		if(!user)
		{
			ws.sendError('Your credentials are not right.');
			return;
		}

		ws.username = msg.username;
		ws.userId = user._id;
		ws.source = msg.source;

		ws.sendSuccess('You\'re authenticated.');
	});
}

module.exports = { http, ws };