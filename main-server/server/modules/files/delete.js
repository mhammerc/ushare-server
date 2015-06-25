'use strict';

let File = require('./models/file');
let UserSecurity = require('./../users/models/user_security');
let Stats = require('./../stats/models/stats');

/* This controller delete files if the user has authorization on it. */
function deleteFile(req, res)
{
	if(!req.body.accountkey || !req.body.privatekey || !req.body.shortname || !req.body.source)
	{
		res.status(400).sendError('You must follow the API. See docs for more informations.');
		return;
	}

	UserSecurity.verifyIdentity(req.body.accountkey, req.body.privatekey, function(err, user)
	{
		if(handleError(err))
		{
			res.status(500).sendError(`Internal error`);
			return;
		}

		if(!user)
		{
			res.status(403).sendError('Your credentials are not right.');
			return;
		}

		File.findOne({ shortName: req.body.shortname, available: true }, function(err, file)
		{
			if(handleError(err))
			{
				res.serverError(err);
				return;
			}

			if(!file)
			{
				res.status(400).sendError('The file provided does not exist.');
				return;
			}

			if(!file.author || file.author !== user._id)
			{
				res.status(403).sendError('You\'ve no rights on this file.');
				return;
			}

			file.available = false;
			
			file.save(function(err)
			{
				if(handleError(err))
				{
					res.serverError(err);
					return;
				}

				res.sendSuccess('File successfully deleted.');
				
				Stats.findOne(function(err, document) {
					if(handleError(err)) return;

					++document.files.notAvailable;
					--document.files.available;
					
					++document.actions.deleteFile;
					
					document.save(function(err) { handleError(err); });
				});
			});
		});
	});
}

module.exports = deleteFile;