'use strict';

let Updates = require('./models/updates_infos.js');

function router()
{
	ExpressApp.get('/info', function(req, res)
	{
		Updates.find(function(err, docs)
		{
			if (err)
			{
				res.send(JSON.stringify({success: false, message: 'An error happened.'}));
				return;
			}

			docs.success = true;
			res.send(JSON.stringify(docs));
		});
	});
}

module.exports = router;