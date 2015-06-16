Newsletter = new Mongo.Collection('newsletter');
Mails = new Mongo.Collection('mails');

function hasAlreadyRegistered(email, ip)
{
	return !!Newsletter.findOne({ $or: [{email: email}, {ip: ip}] });
}

Meteor.methods(
{	
	register: function(email)
	{
		check(email, String);

		if(!validator.isEmail(email))
		{
			throw new Meteor.Error('not-email', 'You\'re email isn\'t one.');
			return;
		}

		if(hasAlreadyRegistered(email, headers.getClientIp()))
		{
			throw new Meteor.Error('already-registered', 'You are already registered.');
			return;
		}

		Newsletter.insert({email:email, ip: headers.getClientIp()});

		Mails.insert(
		{
			content: emailTemplate,
			recipient: email,
			subject: 'Inscription à la bêta de uShare !',
			type: 'html',
			sended: false
	       });

		console.log('Newsletter for ' + email + ' (' headers.getClientIp() + ')');
	},
	hasAlreadyRegistered: function(email) { return hasAlreadyRegistered(email, this.connection.clientAddress); }
})
