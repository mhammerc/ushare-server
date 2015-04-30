var File = require('./models/file');
var UserSecurity = require('./../users/models/user_security');
var chance = require('chance');

/* This function call a callback with a randomly generated shortName with the garantee that
 * this shortName is not already used.
 */
function getRandomShortName(callback)
{
	var shortName = chance(Date.now()).string(Config.newFiles.shortName);

	File.find({shortName:shortName}, function(err, document)
	{
		if(err)
		{
			uShare.logError('Error on getting new shortName', err);
			callback(false);
		}

		if(document.length !== 0)
		{
			/* If this shortName already exist, just rerun the getter. */
			getRandomShortName(callback);
		}

		callback(shortName);
	});
}

/* This controller hold receptions of files. He verify them, register them inside MongoDB 
 * then save them. 
 */
function upload(req, res)
{
	if(!req.files.file)
	{
		return res.status(404).sendError('File missing in field \'file\'.');
	}

	if(!req.body.source)
	{
		return res.sendError('You need to provide a source.');
	}

	getRandomShortName(function(shortName)
	{
		if(!shortName)
		{
			res.status(500).sendError('An error occurred.');
		}

		var fileData = new File(); // The file inside MongoDB
		var file = req.files.file; // The file by itself

		fileData.shortName = shortName;

		fileData.fileName = file.name;
		fileData.originalFileName = file.originalname;
		fileData.path = file.path;
		fileData.encoding = file.encoding;
		fileData.mimetype = file.mimetype;
		fileData.extension = file.extension;
		fileData.size = file.size;
		fileData.source = req.body.source;

		UserSecurity.verifyIdentity(req.body.accountkey, req.body.privatekey, function(err, author)
		{
			if(err)
			{
				var date = uShare.logError('error on verifying identity on an upload.');
				res.status(500).sendError('Internal error. Please warn us with the following key : '
					+ date);
				return;
			}

			if(!author)
				fileData.author = null;
			else
			{
				fileData.author = author._id;
				author.incrementNumberOfFiles();
				author.save();
			}

			fileData.save(function (err, fileData)
			{
				if(err)
				{
					uShare.logError('Error on saving a file inside MongoDB.', err, {
						ip: req.ip, 
						body: req.body,
						file: file
					});

					return res.status(500).sendError('Internal error, please warn us with the following '
													+ `key: ${Date.now()}`);
				}

				var date = new Date(Date.now());

				/* Log something like this : 
				 * 'File 'FileName.exe' received at 3/27/2015 23:47:1:695' 
				 */
				uShare.notice(`File '${fileData.fileName}' received at ` 
					+ `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ` 
					+ `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:` 
					+ `${date.getMilliseconds()} (${fileData._id})`);

				res.status(200).send(fileData.shortName);
			}); /* fileData.save() */
		}); /* UserSecurity.verifyIdentity */
	}); /* getRandomShortName() */
}

module.exports = upload;

