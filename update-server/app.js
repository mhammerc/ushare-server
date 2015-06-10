'use strict';

let router = require('./router');

function start()
{
	router();

	ExpressApp.listen(Config.app.port, function(err)
	{
		if(!err)
		{
			console.log(`App started on port ${Config.app.port}`);
		}
	})
}

module.exports = start;