var FileSchema = new Mongoose.Schema({
	shortName: String,
	fileName: String,
	originalFileName: String,
	encoding: String,
	mimetype: String,
	extension: String,
	size: Number,
	password: {
		type: String,
		default: ""
	},
	views: {
		type: Number,
		default: 0
	},
	receivedAt: {
		type: Date,
		default: Date.now
	},
	lastViewAt: {
		type: Date,
		default: Date.now
	},
	sourceName: String,
	author: String
});

module.exports = Mongoose.model('File', FileSchema);

