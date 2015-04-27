var router = require('./router');

/* Once we get connected to MongoDB, let's start the app */
function start() {

	// Create routes
	router();
}

module.exports = start;

