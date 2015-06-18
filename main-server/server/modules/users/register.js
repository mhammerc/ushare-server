'use strict';

let User = require('./models/user');
let Stats = require('./../stats/models/stats');
let validator = require('validator');
let chance = require('chance');

/* This controller register the user.
 * You must give in an x-www-form-urlencoded POST request the following datas :
 *   - username : String who contain your username.
 *   - email : your email
 *   - password : your password as sha-256
 *   - source : the codename of your app
 */
function register(req, res)
{
	let body = req.body;

	/* -- Verifying datas -- */

	if(!body.username || !body.email || !body.password || !body.source)
	{
		res.status(404).sendError('You must provide a username, an email, a password and finally '
			+ 'the source name.');

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
	
	if(!validator.isLength(body.password, 128, 128))
	{
		res.status(404).sendError('Your password must be encrypted has SHA-256 and sended as Hexa.');
		
		return;
	}
	
	/* -- Verifying if a similar user is already existing -- */

	let isUserAlreadyExisting = User.find().or(
		[
		{
			username: body.username
		}, 
		{
			mainEmailAddress: body.email
		}]);

	isUserAlreadyExisting.exec(function(err, doc)
	{
		if(handleError(err))
		{
			res.status(500).sendError('An error occurred. Please contact us '
				+ `with this following key : ${err}`);

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

		let user = new User();

		user._id = chance(Date.now()).string(Config.mongo._id);
		user.username = body.username;
		user.setPassword(body.password);
		user.addEmailAddress(body.email);

		user.save(function(err, document)
		{
			if(handleError(err))
			{
				res.serverError(err);
				return;
			}

			uShare.logNotice('New user created.', null, { ip: req.ip, body });

			res.sendSuccess('Successfully registered!');

			Stats.findOne(function(err, document) 
			{
				if(handleError(err)) return;

				++document.users.accounts.total;
				document.save(function(err){ handleError(err); });
			});

		}); /* user.save() */
	}); /* isUserAlreadyExisting.exec() */
} /* Controller register() */

module.exports = register;
