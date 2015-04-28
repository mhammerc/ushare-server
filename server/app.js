var router = require('./router');

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

	ExpressApp.listen(3000, function(err)
	{
		if(!err)
		{
			uShare.notice('App started');
		}
	});
}

module.exports = start;

