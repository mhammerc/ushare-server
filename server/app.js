var router = require('./router');

/* Once we get connected to MongoDB, let's start the app by itself */
function start() {

	// Create routes
	router();
}

module.exports = start;

