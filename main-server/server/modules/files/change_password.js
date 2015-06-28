'use strict';

let File = require('./models/file');
let UserSecurity = require('./../users/models/user_security');
let Stats = require('./../stats/models/stats');

/* This controller permit the user to change the password of a file if he has right autorizations */
function http(req, res)
{
	let body = req.body;

	if (!body.accountkey || !body.privatekey || !body.shortname || !body.source)
	{
		res.status(400).sendError('You must follow the API. See docs for more informations.');
		return;
	}

	if (!body.password)
	{
		body.password = '';
	}

	UserSecurity.verifyIdentity(body.accountkey, body.privatekey, function(err, user)
	{
		if (handleError(err))
		{
			res.serverError(err);
			return;
		}

		if (!user)
		{
			res.status(403).sendError('Your credentials are not right.');
			return;
		}

		File.findOne(
		{
			shortName: body.shortname,
			available: true
		}, function(err, file)
		{
			if (handleError(err))
			{
				res.serverError(err);
				return;
			}

			if (!file)
			{
				res.status(404).sendError('The file provided does not exist.');
				return;
			}

			if (!file.author || file.author !== user._id)
			{
				res.status(403).sendError('You\'ve no rights on this file.');
				return;
			}

			file.password = body.password;

			file.save(function(err)
			{
				if (handleError(err)) return serverError(err);

				res.sendSuccess('Password edited.');

				Stats.findOne(function(err, document)
				{
					if (handleError(err)) return;

					++document.actions.changePassword;
					document.save(function(err)
					{
						handleError(err);
					});
				});
			});

		});
	});
}

module.exports = http;