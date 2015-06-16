'use strict';

let Emails = require('./models/mail');

let Mailjet = require('mailjet-sendemail');
let mailjet = new Mailjet(Config.mailjet.apiKey, Config.mailjet.secretKey);

function app()
{
	Emails.find({sended: false}, function(err, documents)
	{
		if(err) return;

		if(documents.length === 0) return;

		for(let i = 0; i < documents.length; ++i)
		{
			let document = documents[i];
		
			mailjet.sendContent(Config.senderEmail, document.recipient, document.subject,
					document.type, document.content);

			document.sended = true;
			document.save(function(err){if(err) console.log(err);});
		}
	});

	setTimeout(app, 3000);
}

module.exports = app;
