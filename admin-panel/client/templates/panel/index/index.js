Template.PanelIndex.helpers(
{
	totalViews: function()
	{
		return Stats.findOne().views.notSilent;
	},
	totalFiles: function()
	{
		return Stats.findOne().files.total;
	},
	totalUsers: function()
	{
		return Stats.findOne().users.accounts.total;
	},
	totalAuths: function()
	{
		return Stats.findOne().users.auths.activated;
	}
});

function findPercentageForFileType(type, name)
{
	Meteor.call('findPercentageForFileType', type, function(err, result)
	{
		Session.set(name, result);
	});
}

function countFiles()
{
	Meteor.call('countFiles', function(err, result)
	{
		Session.set('totalNumberOfFiles', result);
	});
}

Template.PanelIndex.onRendered(function()
{
	findPercentageForFileType('image', 'image');
	findPercentageForFileType('text', 'text');
	findPercentageForFileType('video', 'video');
	findPercentageForFileType('audio', 'audio');
	countFiles();

	Tracker.autorun(function()
	{
		var otherFiles = Session.get('totalNumberOfFiles') - Session.get('image')
						- Session.get('text') - Session.get('video') - Session.get('audio');

		var data = [];

		data.push(
		{
			value: Session.get('image'),
			color: '#F7464A',
			highlight: '#FF5A5E',
			label: "Images"
		});

		data.push(
		{
			value: Session.get('text'),
			color: '#46BFBD',
			highlight: '#5AD3D1',
			label: "Pastes"
		});

		data.push(
		{
			value: Session.get('audio'),
			color: '#FDB45C',
			highlight: '#FFC870',
			label: "Audio"
		});

		data.push(
		{
			value: Session.get('video'),
			color: '#8e44ad',
			highlight: '#9b59b6',
			label: "Video"
		});

		data.push(
		{
			value: otherFiles,
			color: '#2980b9',
			highlight: '#3498db',
			label: "Other"
		});

		var filesTypeChartElement = document.getElementById('filesTypeChart').getContext('2d');
		var filesTypeChart = new Chart(filesTypeChartElement).Doughnut(data);
	});
});