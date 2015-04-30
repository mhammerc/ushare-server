var User = require('./user');
var chance = require('chance');
var validator = require('validator');

/* UserSecuritySchema define the collection who store every privateKey with his accountKey. 
 * Note that the accountKey is the _id of the user but shhhhhht.
 */
var UserSecuritySchema = new Mongoose.Schema(
{
	accountKey: Mongoose.Schema.ObjectId, // The _id of a user
	privateKey: String,
	source: String,
	ipv4: String,
	isValid:
	{
		type: Boolean,
		default: true
	},
	createdAt:
	{
		type: Date,
		default: Date.now
	},
	lastAccessAt:
	{
		type: Date,
		default: Date.now
	}
});

/* This function verify if an identity is right then get the user. You must pass three arguments :
 *   - userId: the _id of the involved user 
 *   - privateKey: the privateKey to test
 *   - cb: the callback to call with err as first argument (always null) and a User as second
 *		   argument.
 */
UserSecuritySchema.statics.verifyIdentity = function verifyIdentity(userId, privateKey, cb)
{
	if(!userId || !privateKey)
	{
		cb(null, false);
		return;
	}

	if(!validator.isMongoId(userId))
	{
		cb(null, false);
		return;
	}

	this.findOne(
	{
		accountKey: userId,
		privateKey: privateKey,
		isValid: true
	}, function(err, result)
	{
		if(err)
		{
			cb(err, false);
			return;
		}

		if(!result)
			return cb(null, false);
		
		User.findById(result.accountKey, function(err, document)
		{
			if(err)
			{
				cb(err, false);
				return;
			}

			if(!document)
			{
				cb(false, false);
				return;
			}

			cb(false, document);
		});
	});
};

UserSecuritySchema.methods.generateNewPrivateKey = function generateNewPrivateKey()
{
	this.privateKey = chance(Date.now()).string(Config.privateKeyOptions);
	return this.privateKey;
};

module.exports = Mongoose.model('users_security', UserSecuritySchema);