var User = require('./models/user');


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

	if(!body.username || !body.email || !body.password || !body.source)
	{
		res.status(404).sendError('You must provide a username, an email, a password and finally'
			+ 'the source name.')
	}

	var user = new User();

	user.username = body.username;
	user.setPassword(body.password);
	user.addEmailAddress(body.email);

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
			Logs.log(
			{
				message: 'Error on verifying existance of user',
				err: err,
				additionalInformations:
				{
					ip: req.ip,
					body: body
				}
			}, 'error');

			res.status(500).sendError('An error occurred. Please contact us '
				+ `with this following key : ${Date.now()}`);
			return;
		}

		if(typeof doc[0] !== 'undefined')
		{
			Logs.log({
				message: 'User already registered',
				additionalInformations:
				{
					ip: req.ip,
					body: body
				}
			}, 'notice');

			res.sendError('You are already registered');
			return;
		}

	user.save(function(err, document)
	{
		if(err)
		{
			Logs.log(
			{
				message:'Error on creating new user',
			 	err: err, 
				additionalInformations:
				{
					ip: req.ip,
					body: body
				}
			}, 'error');

			res.status(500).sendError('An error occurred. Please contact us withh this following'
			 	+ `key : ${Date.now()}`);
			return;
		}

		Logs.log(
		{
			message: 'New user created',
			additionalInformations:
			{
				ip: req.ip,
				body: body
			}
		}, 'notice');

		res.sendSuccess('Successfully registered!');
	}); /* user.save() */
	}); /* isUserAlreadyExisting.exec() */
} /* Controller register() */

module.exports = register;