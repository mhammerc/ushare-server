'use strict';

let router = require('./router');

/* Just a little middleware to make responses easiers */
ExpressApp.use(function(req, res, next)
{
	res.sendError = function(error)
	{
		res.json({success:false, message:error});
		return res;
	}

	res.sendSuccess = function(message)
	{
		res.json({success:true, message:message});
		return res;
	}

	next();
});

/* Once we get connected to MongoDB, let's start the app */
function start()
{
	// Create routes
	router();

	ExpressApp.listen(Config.app.port, function(err)
	{
		if(!err)
		{
			uShare.notice(`App started on port ${Config.app.port}`);
		}
	});
}

module.exports = start;

