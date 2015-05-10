'use strict';

let bcrypt = require('bcrypt');
let chance = require('chance');

let LoginTokensSchema = new Mongoose.Schema({
	when: Date,
	hashedToken: String,
});

let EmailSchema = new Mongoose.Schema({
	address: String,
	verified: Boolean,
});

/* This function encrypt the password through the Meteor way.
 * BUT it's REALLY important : you MUST pass the password as SHA-256.
 * Note that the accountKey is the _id of the user but shhhhht.
 */
function encryptPassword(password)
{
	return bcrypt.hashSync(password, 10);
}

let UserSchema = new Mongoose.Schema(
{
	_id:
	{
		type: String,
		default: chance(Date.now()).string(Config.mongo._id)
	},
	username: String,
	mainEmailAddress: String,
	profile: 
	{
		numberOfFiles: 
		{
			type: Number,
			default: 0,
		},
		numberOfViews:
		{
			type: Number,
			default: 0,
		},
		accountType:
		{
			type: String,
			default: 'regular',
		},
	},
	createdAt:
	{
		type: Date,
		default: Date.now,
	},
	services:
	{
		password:
		{
			bcrypt: 
			{
				type: String,
				set: encryptPassword,
			},
		},
		resume: 
		{
			loginTokens: [LoginTokensSchema],
		},
	},
	emails: [EmailSchema],
});

/* This function try to get an user with the given informations.
 * The function take 3 arguments :
 *   - username: username of the user
 *   - password: password of the user as SHA-256 (by default the client already transmit it as 
 *		SHA-256)
 *   - cb: callback with this definition callback(err, user). user is the researched user if it
 *			exist.
 */
UserSchema.statics.getUser = function getUser(username, password, cb)
{
	this.findOne({username}, function(err, document)
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
		verified: false,
	});

	if(!this.mainEmailAddress)
	{
		this.mainEmailAddress = email;
	}
}

UserSchema.methods.incrementNumberOfFiles = function incrementNumberOfFiles()
{
	++this.profile.numberOfFiles;
}

UserSchema.methods.incrementNumberOfViews = function incrementNumberOfViews()
{
	++this.profile.numberOfViews;
}

module.exports = Mongoose.model('users', UserSchema);