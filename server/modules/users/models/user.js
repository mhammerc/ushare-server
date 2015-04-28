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
 */
function encryptPassword(password)
{
	//var salt = bcrypt.genSaltSync(10);
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