var FileSchema = new Mongoose.Schema(
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
		default: ""
	},
	views:
	{
		type: Number,
		default: 0
	},
	receivedAt:
	{
		type: Date,
		default: Date.now
	},
	lastViewAt: Date,
	source: String,
	author: 
	{
		type: Mongoose.Schema.ObjectId, // The _id of a user
		default: null
	},
	available: 
	{
		type: Boolean,
		default: true
	}
});

FileSchema.methods.incrementViewNumber = function incrementViewNumber()
{
	++this.views;	
};

module.exports = Mongoose.model('File', FileSchema);

