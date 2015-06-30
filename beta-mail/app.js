'use strict';

let mongoose = require('mongoose');
let mailsAddress = require('./mails.json');
let fs = require('fs');
let mailTemplate = fs.readFileSync('./mail.html');

mongoose.connect('mongodb://localhost/ushare');

let MailSchema = new Mongoose.Schema(
{
	_id: { type: String, },
	recipient: String,
	subject: String,
	type: String, // text or html
	content: String,
	sended: Boolean,
});


let MailDatabase = Mongoose.model('Mails', MailSchema);

for(let i = 0; i < mailsAddress.length; ++i)
{
    let mail = new MailsDatabase;
    mail.subject = 'Bêta de uShare';
    mail.content = mailTemplate;
    mail.recipient = mailsAddress[i].email;
    mail.sended = false;
    mail.type = 'html';
    mail.save(function(err){if(!err)console.log('One more email sended!');});
}