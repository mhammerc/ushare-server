'use strict';

let FileSchema = new Mongoose.Schema(
{
	shortName: String, // The file short id, used in URLs
	fileName: String, // The stored file name
	originalFileName: String, // The original file name
	path: String,
	encoding: String,
	mimetype: String,
	extension: String,
	size: Number, // In bytes
	password:
	{
		type: String,
		default: '',
	},
	views:
	{
		silent:
		{
			type: Number,
			default: 0,
		},
		notSilent:
		{
			type: Number,
			default: 0,
		},
	},
	receivedAt:
	{
		type: Date,
		default: Date.now,
	},
	lastViewAt: 
	{
		type: Date,
		default: Date.now,
	},
	source: String,
	author: 
	{
		type: String, // The _id of a user
		default: null,
	},
	available: 
	{
		type: Boolean,
		default: true,
	}
});

FileSchema.methods.incrementViewNumber = function incrementViewNumber()
{
	++this.views.notSilent;
	this.lastViewAt = Date.now();
};

FileSchema.methods.incrementSilentViewNumber = function incrementSilentViewNumber()
{
	++this.views.silent;
}

module.exports = Mongoose.model('File', FileSchema);
