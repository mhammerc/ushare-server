var EventsLogs = new Mongoose.Schema(
{
	loggedAt:
	{
		type: Date,
		default: Date.now
	},
	what: Mongoose.Schema.Types.Mixed,
	category: String
});

EventsLogs.statics.log = function(what, category)
{
	var event = new this();

	event.what = what;
	event.category = category;

	event.save();
}

module.exports = Mongoose.model('EventsLogs', EventsLogs);