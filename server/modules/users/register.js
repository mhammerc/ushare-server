var User = require('./models/user');
var validator = require('validator');

/* This controller register the user.
 * You must give in an x-www-form-urlencoded POST request the following datas :
 *   - username : String who contain your username.
 *   - email : your email
 *   - password : your password as sha-512
 *   - source : the codename of your app
 */
function register(req, res)
{
	var body = req.body;

	/* -- Verifying datas -- */

	if(!body.username || !body.email || !body.password || !body.source)
	{
		res.status(404).sendError('You must provide a username, an email, a password and finally'
			+ 'the source name.')

		return;
	}

	if(!validator.isEmail(body.email))
	{
		res.status(404).sendError('You must provide a valid email address');

		return;
	}

	if(!validator.isLength(body.username, 3, 20))
	{
		res.status(404).sendError('Your username must has at least 3 characters.');

		return;
	}

	/*
	if(!validator.isLength(body.password, 128, 128))
	{
		res.status(404).sendError('Your password must be encrypted has SHA512 and sended as Hexa.');
	}
	*/

	/* -- Verifying if a similar user is already existing -- */

	var isUserAlreadyExisting = User.find().or(
		[
		{
			username: body.username
		}, 
		{
			mainEmailAddress: body.email
		}]);

	isUserAlreadyExisting.exec(function(err, doc)
	{
		if(err)
		{
			uShare.logError('Error on verifying existance of user in register.js.', err,
			 				{ip: req.ip, body: body});

			res.status(500).sendError('An error occurred. Please contact us '
				+ `with this following key : ${Date.now()}`);

			return;
		}

		if(doc.length !== 0) // Similar user is existing
		{
			uShare.logNotice('User already registered just try to register.', null, 
							{ip:req.ip,body:body});

			res.sendError('You are already registered');

			return;
		}

		/* -- Well, everything is fine. Proceed to the registration. -- */

		var user = new User();

		user.username = body.username;
		user.setPassword(body.password);
		user.addEmailAddress(body.email);

		user.save(function(err, document)
		{
			if(err)
			{
				uShare.logError('Error on creating a new user.', err, {ip: req.ip,body: body});

				res.status(500).sendError('An error occurred. Please contact us with this following'
				 	+ `key : ${Date.now()}`);

				return;
			}

			uShare.logNotice('New user created.', null, {ip:req.ip,body:body});

			res.sendSuccess('Successfully registered!');
		}); /* user.save() */
	}); /* isUserAlreadyExisting.exec() */
} /* Controller register() */

module.exports = register;