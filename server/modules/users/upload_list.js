'use strict';

let Files = require('./../files/models/file');

function http(req, res)
{

}

function ws(ws, req)
{
	if(!ws.userId)
	{
		ws.sendError('You must be logged before asking anything');
		return;
	}

	Files.find({author:ws.userId, available:true}, function(err, documents){
		
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
		response.nOfFiles = documents.length;
		response.files = [];

		documents.forEach(function(document, index)
		{
			const file = {};
			file.uid = document.shortName;
			file.name = document.originalFileName;
			file.size = document.size;
			file.mimetype = document.mimetype;
			file.views = document.views;
			file.date = document.receivedAt;
			file.password = document.password;

			response.files.push(file);
		});

		ws.json(response);
	});
}

module.exports = { http, ws };