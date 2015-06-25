'use strict';

/** Stats is a collection with only one entry.
  * The alone entry keep some stats data.
  */
let StatsSchema = new Mongoose.Schema(
{
	users: {
		accounts: {
			total: {
				type: Number,
				default: 0,
			},
		},
		auths: {
			activated: {
				type: Number,
				default: 0,
			},
			disabled: {
				type: Number,
				default: 0,
			},
			total: {
				type: Number,
				default: 0,
			},
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
	actions: {
		changePassword:
		{
			type: Number,
			default: 0,
		},
		deleteFile:
		{
			type: Number,
			default: 0,
		},
	}
});

module.exports = Mongoose.model('Stats', StatsSchema);