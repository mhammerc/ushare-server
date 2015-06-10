Template.FileSmallList.helpers({
	files: function() {
		return getOwnFiles({ limit: 5, sort: { receivedAt: -1 } });
	},
});

Template.ProfileSynthesis.helpers({
	username: function() {
		return Meteor.user().username;
	},
	pictureLink: function() {
		return Session.get('pictureLink');
	},
});

Template.ProfileSynthesis.onRendered(function() {
	var email = CryptoJS.MD5(Meteor.user().emails[0].address.trim().toLowerCase()).toString();
	var link = 'http://www.gravatar.com/' + email + '.json';

	HTTP.get(link, function(err, result) {
		var result = JSON.parse(result);
		Session.set('pictureLink', result.entry[0].thumbnailUrl);
	});
});

Template.FileSynthesis.helpers({
	numberOfFiles: function() {
		return Meteor.user().profile.numberOfFiles;
	},
	numberOfViews: function() {
		return Meteor.user().profile.numberOfViews;
	},
});