if (Meteor.isClient) 
{
  Template.hello.helpers({});

  Template.hello.events(
  {
    'click #submit': function () 
    {
      var email = $('#email').val();

      if(!validator.isEmail(email))
      {
        $('#email').addClass('validate invalid');
        return;
      }

      Meteor.call('register', email, function(err, result)
      {
        $('.email-form').addClass('hide');
        $('.success-registered').removeClass('hide');        
      })
    }
  });

  Template.hello.onRendered(function()
  {
    Meteor.call('hasAlreadyRegistered', function(err, result)
    {
      if(result)
      {
        $('.email-form').addClass('hide');
        $('.success-registered').removeClass('hide');        
      }
    });
  })

}