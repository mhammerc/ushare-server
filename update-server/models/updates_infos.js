'use strict';

let UpdateInfoSchema = new Mongoose.Schema(
{
	os: String,
	arch: String,
	description: String,
	link: String,
	version: String,
});

module.exports = Mongoose.model('Updates', UpdateInfoSchema);