var bookshelf = require('models').bookshelf;
var Promise = require('core/bluebird');

var UserQueue = bookshelf.Model.extend({
	tableName : 'user_queues',
	user : function(){
		return this.belongsTo('User', 'user_id');
	},
	dailyQueue: function() {
		return this.belongsTo('DailyQueue', 'daily_queue_id');
	}
},{
	query : Promise.method(function (queryBuilder) {
		var result = {};
		var UserQueue = this;
		return this.collection()
		.query(function(qb){
			queryBuilder.build(qb);
		})
		.fetch(queryBuilder.withRelated())
		.then(function(collection){
			result.data = collection.toJSON();
			var raw = 'count(*) as total';
			return UserQueue.collection()
			.query(function(qb){
				qb.select(bookshelf.knex.raw(raw));
				queryBuilder.buildConditionsOnly(qb);
			})
			.fetchOne();
		})
		.then(function(model){
			console.log('oooooooo');
			console.log(model.toJSON());
			result.total = model.toJSON().total;
			console.log('sampe sini gak ***********************************');
			console.log(result);
			return Promise.resolve(result);
		});
	}),
	get : Promise.method(function (id) {
		return new this({id:id}).fetch({withRelated:'user'});
	}),
	save : Promise.method(function (data) {
		return new this(data).save();
	}),
	delete : Promise.method(function (id) {
		return new this({id:id}).destroy();
	}),
	getByParams : Promise.method(function (params) {
		return new this(params).fetch({withRelated:['user', 'dailyQueue', 'dailyQueue.hospital', 'dailyQueue.hospitalService']});
	}),
});

module.exports = bookshelf.model('UserQueue', UserQueue);