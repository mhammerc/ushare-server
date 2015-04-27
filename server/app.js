var router = require('./router');

/* Once we get connected to MongoDB, let's start the app */
function start()
{
	// Create routes
	router();

	ExpressApp.listen(3000, function(err)
	{
		if(!err)
		{
			Notice('App started');
		}
	});
}

module.exports = start;

