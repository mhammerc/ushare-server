Template.Login.events({
	'submit #main-form': function(event) {

		var username = event.target.username.value;
		var password = event.target.password.value;

		Meteor.loginWithPassword(username, password, function(err) {
			
			if(err)
			{
				$('#password').removeClass('valid').addClass('invalid');
				$('#username').removeClass('valid').addClass('invalid');
				$('#error').removeClass('hide');
			}

		});

		return false;
	}
});