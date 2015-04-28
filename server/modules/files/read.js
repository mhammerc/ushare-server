var path = require('path');
var File = require('./models/file');

/* This controller handle all request that match '/:id'
 * It's usually the route used to see a file
 * So we get the file and return it.
 */
function read(req, res)
{
	File.findOne({'shortName' : req.params.id}).exec(function(err, document)
	{
		if(err || !document)
		{
			return res.status(404).send('Could not find your file.');
		}

		var filePath = path.resolve(`${Config.fileDest}${document.fileName}`);

		return res.sendFile(filePath, {}, function(err)
		{
			if(err)
			{
				return res.status(err.status).end();
			}

			document.incrementViewNumber();

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