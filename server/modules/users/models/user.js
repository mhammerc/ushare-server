var bcrypt = require('bcrypt');

var LoginTokensSchema = new Mongoose.Schema({
	when: Date,
	hashedToken: String
});

var EmailSchema = new Mongoose.Schema({
	address: String,
	verified: Boolean
});

/* This function encrypt the password through the Meteor way.
 * BUT it's REALLY important : you MUST pass the password as SHA512.
 * Note that the accountKey is the _id of the user but shhhhht.
 */
function encryptPassword(password)
{
	return bcrypt.hashSync(password, 10);
}

var UserSchema = new Mongoose.Schema(
{
	username: String,
	mainEmailAddress: String,
	profile: 
	{
		numberOfFiles: 
		{
			type: Number,
			default: 0
		}
	},
	createdAt:
	{
		type: Date,
		default: Date.now
	},
	services:
	{
		password:
		{
			bcrypt: 
			{
				type: String,
				set: encryptPassword
			}
		},
		resume: 
		{
			loginTokens: [LoginTokensSchema]
		}
	},
	emails: [EmailSchema]
});

/* This function try to get an user with the given informations.
 * The function take 3 arguments :
 *   - username: username of the user
 *   - password: password of the user as SHA512 (by default the client already transmit it as 
 *		SHA512)
 *   - cb: callback with this definition callback(err, user). user is the researched user if it
 *			exist.
 */
UserSchema.statics.getUser = function getUser(username, password, cb)
{
	this.findOne({username:username}, function(err, document)
	{
		if(err)
		{
			cb(err, false);
			return;
		}

		if(!document)
		{
			cb(null, false);
			return;
		}

		bcrypt.compare(password, document.services.password.bcrypt, function(err, result)
		{
			if(err)
			{
				cb(err, false);
				return;
			}

			if(!result)
			{
				cb(null, false);
				return;
			}

			cb(null, document);
			return;
		});
	});
}

UserSchema.methods.setPassword = function setPassword(pass)
{
	this.services.password.bcrypt = pass;
}

UserSchema.methods.addEmailAddress = function addEmailAddress(email)
{
	this.emails.push(
	{
		address: email, 
		verified: false
	});

	if(!this.mainEmailAddress)
	{
		this.mainEmailAddress = email;
	}
}

module.exports = Mongoose.model('users', UserSchema);