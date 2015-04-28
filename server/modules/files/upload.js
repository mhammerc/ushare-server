var File = require('./models/file');
var chance = require('chance');

/* This controller hold receptions of files. He verify them, register them inside MongoDB 
 * then save them. 
 */
function upload(req, res)
{
	if(!req.files.file)
	{
		return res.status(404).json({success:false, error:'File missing in field \'file\'.'});
	}

	var fileData = new File(); // The file inside MongoDB
	var file = req.files.file; // The file by itself

	fileData.shortName = chance(Date.now()).string(Config.newFiles.shortName);

	fileData.fileName = file.name;
	fileData.originalFileName = file.originalname;
	fileData.path = file.path;
	fileData.encoding = file.encoding;
	fileData.mimetype = file.mimetype;
	fileData.extension = file.extension;
	fileData.size = file.size;

	if(req.body.version)
	{
		fileData.sourceName = req.body.version;
	}

	fileData.save(function (err, fileData)
	{
		if(err)
		{
			uShare.error(err);
			return res.status(500).json({success:false, error:'Internal error, please warn us.'});
		}

		var date = new Date(Date.now());

		/* Log something like this : 
		 * 'File 'FileName.exe' received at 3/27/2015 23:47:1:695' 
		 */
		uShare.notice(`File '${fileData.fileName}' received at ` 
			+ `${date.getMonth()}/${date.getDate()}/${date.getFullYear()} ` 
			+ `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:` 
			+ `${date.getMilliseconds()}`);

		res.status(200).send(fileData.shortName);
	});
}

module.exports = upload;

