var bookshelf = require('models').bookshelf;
var Promise = require('core/bluebird');
var authorization = require('core/authorization');

var UserQueue = bookshelf.Model.extend({
	tableName : 'user_queues',
	user : function(){
		return this.belongsTo('User', 'user_id');
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
			result.total = model.toJSON().total;
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
	})
});

module.exports = bookshelf.model('UserQueue', UserQueue);