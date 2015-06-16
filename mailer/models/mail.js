'use strict';

let MailSchema = new Mongoose.Schema(
{
	_id: { type: String, },
	recipient: String,
	subject: String,
	type: String, // text or html
	content: String,
	sended: Boolean,
});


module.exports = Mongoose.model('Mails', MailSchema);
