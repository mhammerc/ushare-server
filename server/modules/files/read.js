'use strict';

let path = require('path');
let File = require('./models/file');
let User = require('./../users/models/user');

/* This controller handle all request that match '/:id'
 * It's usually the route used to see a file
 * So we get the file and return it.
 * Silent is an optionnal parameter. If it is true, we do not increment the counter of the file.
 */
function read(req, res, silent)
{
	// Find the file
	File.findOne({'shortName': req.params.id, available: true}, function(err, document)
	{
		if(err || !document)
		{
			res.status(404).send('Could not find your file.');

			if(handleError(err))
			{
				res.status(500).sendError(`Internal error. Please warn us with the following key: ${err}`);
			}

			return;
		}

		let filePath = path.resolve(`${Config.files.destination}${document.fileName}`);

		return res.sendFile(filePath, {}, function(err)
		{
			if(err)
			{
				return res.status(err.status).end();
			}

			// Increment views counters
			if(!silent)
			{
				document.incrementViewNumber();
				
				if(document.author)
				{
					User.findOne(document.author, function(err, document){
						
						if(handleError(err))
						{
							res.status(500).sendError(`Internal error. Please warn us with the following key: ${err}`);
							return;
						}

						document.incrementNumberOfViews();
						document.save(function(err, document)
						{
							if(handleError(err))
							{
								res.status(500).sendError(`Internal error. Please warn us with the following key: ${err}`);
								return;
							}
						});
					});
				}
			}
		});
	});
}

module.exports = read;