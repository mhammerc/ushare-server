'use strict';

let FileSchema = new Mongoose.Schema(
{
	shortName: String,
	fileName: String,
	originalFileName: String,
	path: String,
	encoding: String,
	mimetype: String,
	extension: String,
	size: Number,
	password:
	{
		type: String,
		default: "",
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
	lastViewAt: Date,
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
