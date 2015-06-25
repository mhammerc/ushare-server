'use strict';

let File = require('./models/file');
let UserSecurity = require('./../users/models/user_security');
let Stats = require('./../stats/models/stats');
let chance = require('chance');

/* This function call a callback with a randomly generated shortName with the garantee that
 * this shortName is not already used.
 */
function getRandomShortName(callback)
{
	let shortName = chance(Date.now()).string(Config.newFiles.shortName);

	File.find({ shortName }, function(err, document)
	{
		if(handleError(err))
		{
			callback(false);
			return;
		}

		if(document.length !== 0)
		{
			/* If this shortName already exist, just rerun the getter. */
			getRandomShortName(callback);
			return;
		}

		callback(shortName);
	});
}

/* This controller hold receptions of files. He verify them, register them inside MongoDB 
 * then save them. 
 */
function upload(req, res)
{
	if(!req.files.file || !req.body.source)
	{
		res.status(400).sendError('You must follow the API. See docs for more informations.');
		return;
	}

	getRandomShortName(function(shortName)
	{
		if(!shortName)
		{
			res.status(500).sendError('An error occurred.');
			return;
		}

		let fileData = new File(); // The file inside MongoDB
		let file = req.files.file; // The file by itself

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
			if(handleError(err))
			{
				res.serverError(err);
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
				if(handleError(err))
				{
					res.serverError(err);
					return;
				}

				let date = new Date(Date.now());

				/* Log something like this : 
				 * 'File 'FileName.exe' received at 3/27/2015 23:47:1:695' 
				 */
				uShare.notice(`File '${fileData.fileName}' received at ` 
					+ `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ` 
					+ `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:` 
					+ `${date.getMilliseconds()} (${fileData._id})`);

				res.status(200).send(Config.app.viewUrl + fileData.shortName);

				Stats.findOne(function(err, document)
				{
					if(handleError(err)) return;

					++document.files.available;
					++document.files.total;
					document.save(function(err){ handleError(err); });
				});

			}); /* fileData.save() */
		}); /* UserSecurity.verifyIdentity */
	}); /* getRandomShortName() */
}

module.exports = upload;

