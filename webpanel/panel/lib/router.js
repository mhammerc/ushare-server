ApplicationController = RouteController.extend({
  layoutTemplate: 'ApplicationLayout',

  onBeforeAction: function() {
    
    if(Meteor.user())
    {
    	this.layout('ApplicationLayout');
    	this.next();
    } else {
    	this.layout('LoginLayout');
    	this.render('Login');
    }

  },
});

Router.configure({
	controller: 'ApplicationController',
});

Router.route('/', {
	controller: 'ApplicationController',
	template: 'DashboardIndex',
});

Router.route('/dashboard', {
	controller: 'ApplicationController',
	template: 'DashboardIndex',
})