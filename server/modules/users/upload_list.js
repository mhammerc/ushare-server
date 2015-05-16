'use strict';

let Files = require('./../files/models/file');
let UsersSecurity = require('./models/user_security');

function http(req, res)
{
	let body = req.headers;

	if(!body.accountkey || !body.privatekey || !body.limit || !body.source)
	{
		res.status(404).sendError('You must provide an accountkey, privatekey, limit and the source.');
		return;
	}

	if(typeof body.limit !== "number")
	{
		res.status(404).sendError('limit must be a number.');
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

		let query = Files.find({ author: user._id, available: true });
		query.sort({ receivedAt: -1 });
		query.select('shortName originalFileName size mimetype views.notSilent receivedAt password');
		query.limit(body.limit <= 500 ? body.limit : 500);

		query.exec(function(err, documents) {

			if(handleError(err))
			{
				res.status(500).sendError('Internal error, please warn us with the following key : ' + err);
				return;
			}

			if(!documents || documents.length === 0)
			{
				res.json({ nOfFiles: 0, files: [] });
			}

			const response = {};
			response.numberOfFiles = documents.length;
			response.files = [];

			documents.forEach(function(element) {
				const file = {};

				file.link = Config.app.url + element.shortName;
				file.shortname = element.shortName;
				file.name = element.originalFileName;
				file.size = element.size;
				file.mimetype = element.mimetype;
				file.views = element.views.notSilent;
				file.date = element.receivedAt;
				file.password = element.password;

				response.files.push(file);
			});

			res.json(response);

		});
	});
}

function ws(ws, msg)
{
	if(!ws.userId)
	{
		ws.sendError('You must be logged before asking anything.');
		return;
	}

	if(!msg.limit || typeof msg.limit !== 'number')
	{
		ws.sendError('You must provide a limit.');
		return;
	}

	let query = Files.find({ author: ws.userId, available: true });
	query.sort({ receivedAt: -1 });
	query.select('shortName originalFileName size mimetype views.notSilent receivedAt password');
	query.limit(msg.limit <= 500 ? msg.limit : 500);

	query.exec(function(err, documents) {
		
		if(handleError(err))
		{
			res.status(500).sendError(`Internal error. Please warn us with the following key: ${err}`);
			return;
		}

		if(!documents)
		{
			ws.sendSuccess('No files yet.');
			return;
		}

		const response = {};
		response.numberOfFiles = documents.length;
		response.files = [];

		documents.forEach(function(document)
		{
			const file = {};

			file.link = Config.app.url + document.shortName;
			file.shortname = document.shortName;
			file.name = document.originalFileName;
			file.size = document.size;
			file.mimetype = document.mimetype;
			file.views = document.views.notSilent;
			file.date = document.receivedAt;
			file.password = document.password;

			response.files.push(file);
		});

		ws.json(response);
	});
}

module.exports = { http, ws };