function router() {
	ExpressApp.get('/:id', function(req, res) {

	});

	ExpressApp.get('/silent/:id', function(req, res) {

	});

	ExpressApp.post('/file/upload', function(req, res) {

	});

	ExpressApp.post('/file/delete', function(req, res) {

	});

	ExpressApp.post('/user/register', function(req, res) {

	});

	ExpressApp.post('/user/auth', function(req, res) {

	});

	ExpressApp('/user/info', function(req, res) {

	});

	ExpressApp('/user/uploads', function(req, res) {

	});

	app.get('/', function(req, res) {
		res.redirect(301, 'http://usquare.io');
	});
}

module.exports = router;

