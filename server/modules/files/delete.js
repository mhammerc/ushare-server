var File = require('./models/file');
var UserSecurity = require('./../users/models/user_security');

/* This controller delete files if the user has authorization on it. */
function deleteFile(req, res)
{
	if(!req.body.accountkey || !req.body.privatekey || !req.body.shortname || !req.body.source)
	{
		res.sendError('You must provide account and private keys, id of the file and a source.');
		return;
	}

	UserSecurity.verifyIdentity(req.body.accountkey, req.body.privatekey, function(err, user)
	{
		if(err)
		{
			var date = uShare.logError('Error on verifying identity.', err, {ip:req.ip, 
				body:req.body});
			res.status(500).sendError('Internal error. Please warn us with the following key : '
				+ date);
			return;
		}

		if(!user)
		{
			res.status(403).sendError('Your credentials are not rights.');
			return;
		}

		File.findOne({shortName:req.body.shortname, available:true}, function(err, file)
		{
			if(err)
			{
				var date = uShare.logError('Error on getting file from shortName in delete controller.',
					err, {ip:req.ip, body:req.body});

				res.status(500).sendError('Internal error. Please warn us with the following key : '
					+ date);
				return;
			}

			if(!file)
			{
				res.sendError('The file you provided is not existing.');
				return;
			}

			if(!file.author.equals(user._id))
			{
				res.sendError('You\'ve no rights on this file.');
				return;
			}

			file.available = false;
			file.save(function(err)
			{
				if(err)
				{
					var date = uShare.logError('Can\'t delete files.', err, {ip:req.ip, body:req.body});
					res.status(500).sendError('Internal error. Please warn us with the following key : '
						+ date);
					return;
				}

				res.json({status:'success'});
				return;
			});
		});
	});
}

module.exports = deleteFile;