'use strict';

let path = require('path');
let File = require('./models/file');

/* This controller handle all request that match '/:id'
 * It's usually the route used to see a file
 * So we get the file and return it.
 * Silent is an optionnal parameter. If it is true, we do not increment the counter of the file.
 */
function read(req, res, silent)
{
	File.findOne({'shortName': req.params.id, available: true}, function(err, document)
	{
		if(err || !document)
		{
			return res.status(404).send('Could not find your file.');
		}

		let filePath = path.resolve(`${Config.files.destination}${document.fileName}`);

		return res.sendFile(filePath, {}, function(err)
		{
			if(err)
			{
				return res.status(err.status).end();
			}

			if(!silent)
			{
				document.incrementViewNumber();
			}

			document.save(function(err, document)
			{
				if(err)
				{
					return uShare.error(err);
				}
			});
		});
	});
}

module.exports = read;