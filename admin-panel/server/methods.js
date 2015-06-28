Meteor.methods(
{
	findPercentageForFileType: function(type)
	{
		check(type, String);

		var numberOfFilesWithType = Files.find({ 'mimetype': { $regex: '.*' + type + '*.' }}).count();

		return numberOfFilesWithType;
	},
	countFiles: function()
	{
		return Files.find().count();
	}
});