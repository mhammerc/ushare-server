var FileSchema = new Mongoose.Schema({
	shortName: String,
	originalName: String,
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
	ushareVersion: String,
	author: String
});

module.exports = Mongoose.model('File', FileSchema);

