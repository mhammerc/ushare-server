Router.route('/', function()
{
	if(!Meteor.user())
	{
		this.layout('LoginLayout');
		this.render('Login');
		return;
	}
	
	this.redirect('/panel');

});

PanelController = RouteController.extend(
{
	layoutTemplate: 'PanelLayout',
	onBeforeAction: function()
	{
		if(!Meteor.user())
		{
			this.redirect('/');
			return;
		}

		this.next();
	}
});

Router.route('/panel',
{
	name: 'panel.index',
	template: 'PanelIndex',
	controller: 'PanelController'
});