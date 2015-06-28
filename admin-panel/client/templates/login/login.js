Template.LoginForm.events(
{
	'click #submit': function()
	{
		var username = $('#username');
		var password = $('#password');

		if(!username.val() || !password.val())
		{
			username.addClass('invalid');
			password.addClass('invalid');
			return;
		}

		Meteor.loginWithPassword(username.val(), password.val(), function(err)
		{
			if(err){
				console.log('not authorized');
			}
		});
	}
});