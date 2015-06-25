'use strict';

let Files = require('./../files/models/file');
let UsersSecurity = require('./models/user_security');

function http(req, res)
{
	let body = req.headers;

	if(!body.accountkey || !body.privatekey || !body.limit || !body.source)
	{
		res.status(400).sendError('You must follow the API. See docs for more informations.');
		return;
	}

	if(typeof body.limit !== "number")
	{
		body.limit = parseInt(body.limit, 10);
		
		if(isNaN(body.limit))
		{
			res.status(400).sendError('You must follow the API. See docs for more informations.');
			return;
		}
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

		let query = Files.find({ author: user._id, available: true });
		query.sort({ receivedAt: -1 });
		query.select('shortName originalFileName size mimetype views.notSilent receivedAt password');
		query.limit(body.limit <= 500 ? body.limit : 500);

		query.exec(function(err, documents)
		{
			if(handleError(err))
			{
				res.serverError(err);
				return;
			}

			if(!documents || documents.length === 0)
			{
				res.sendSuccess({ numberOfFiles: 0, files: [] });
				return;
			}

			const response = {};

			response.numberOfFiles = documents.length;
			response.files = [];

			documents.forEach(function(element) 
			{
				const file = {};

				file.link = Config.app.viewUrl + element.shortName;
				file.silentLink = Config.app.apiUrl + 'silent/' + element.shortName;
				file.shortname = element.shortName;
				file.name = element.originalFileName;
				file.size = element.size;
				file.mimetype = element.mimetype;
				file.views = element.views.notSilent;
				file.date = element.receivedAt;
				file.password = element.password;

				response.files.push(file);
			});

			res.sendSuccess(response);

		});
	});
}

module.exports = http;
