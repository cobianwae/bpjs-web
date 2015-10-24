var bookshelf = require('models').bookshelf;
var Promise = require('core/bluebird');
var authorization = require('core/authorization');

var Role = bookshelf.Model.extend({
	tableName : 'roles'
},{
	query : Promise.method(function (queryBuilder) {
		var result = {};
		var Role = this;
		return this.collection()
		.query(function(qb){
			queryBuilder.build(qb);
		})
		.fetch()
		.then(function(collection){
			result.data = collection.toJSON();
			var raw = 'count(*) as total';
			return Role.collection()
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
		return new this({id:id}).fetch();
	}),
	save : Promise.method(function (data) {
		return new this(data).save();
	}),
	delete : Promise.method(function (id) {
		return new this({id:id}).destroy();
	})
});

module.exports = bookshelf.model('Role', Role);