'use strict';

/** Stats is a collection with only one entry.
  * The alone entry keep some stats data.
  */
let StatsSchema = new Mongoose.Schema(
{
	users: {
		total: 
		{
			type: Number,
			default: 0,
		},
	},
	files: {
		total: 
		{
			type: Number,
			default: 0,
		},
		available: 
		{
			type: Number,
			default: 0,
		},
		notAvailable: 
		{
			type: Number,
			default: 0,
		},
	},
	views: {
		total: 
		{
			type: Number,
			default: 0,
		},
		notSilent: 
		{
			type: Number,
			default: 0,
		},
		silent: 
		{
			type: Number,
			default: 0,
		},
	},
});

module.exports = Mongoose.model('stats', StatsSchema);