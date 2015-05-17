'use strict';

let router = require('./router');

/* Just a little middleware to make responses easiers */
ExpressApp.use(function(req, res, next)
{
	res.sendError = function(error)
	{
		res.json({ success: false, message: error });
		return res;
	}

	res.sendSuccess = function(message)
	{
		res.json({ success: true, message });
		return res;
	}

	res.serverError = function(date)
	{
		res.status(500).sendError('Internal error, please warn us with the following key : ' + date);
		return res;
	}

	next();
});

/* Verify if it's the first start. If it is, make some adjustements. */
function firstStart()
{	
	Stats.find().count(function(err, count)
	{
		// TODO - handle err argument

		if(count !== 0)
			return;

		uShare.notice('First start, preparing the ground...');

		let stat = new Stats();
		stat.save(function(err, document)
		{
			uShare.notice('First start preparations done. Server ready to use! :-D');
		});
	});
}

/* Once we get connected to MongoDB, let's start the app */
function start()
{
	// Verify if the server is making his first start
	firstStart();

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

