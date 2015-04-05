var auth = require('../user/auth/connect_auth');

var resolver = require('../../resolver');
var tools = require('../../tools');

/* Controller */
function deletef(req, res)
{
	var credentials = req.body;
	var shortName = req.body.shortName;

	if (!tools.exist(credentials.accountKey) || !tools.exist(credentials.privateKey))
	{
		res(true, tools.error(551, 'Check your credentials'));
		return;
	}

	auth.getUserFromAuth(credentials, function(err, author)
	{
		if (err !== null)
		{
			res(true, tools.error(551, 'Check your credentials'));
			return;
		}

		var db = resolver.resolve('db');
		var files = db.collection('files');

		files.findOneAndDelete(
		{
			shortName: shortName,
			author: author
		}, function(err, doc)
		{
			if (err !== null)
			{
				res(true, tools.error(500, 'File not found'));
			}

			var answer = {
				success: true
			};

			res(null, tools.otj(answer));
		});

	})

}

exports.deletef = deletef;

