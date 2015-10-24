var bookshelf = require('models').bookshelf;
var Promise = require('core/bluebird');
var authorization = require('core/authorization');

var Hospital = bookshelf.Model.extend({
	tableName : 'hospitals',
	services : function(){
		return this.belongsToMany('HospitalService','hospital_services', 'hospital_id', 'service_id');
	}
},{
	queryNearbyHospitals : Promise.method(function(queryBuilder){
		return this.collection()
		.query(function(qb){
			queryBuilder.build(qb);
		})
		.fetch()
	}),
	query : Promise.method(function (queryBuilder) {
		var result = {};
		var Hospital = this;
		return this.collection()
		.query(function(qb){
			queryBuilder.build(qb);
		})
		.fetch()
		.then(function(collection){
			result.data = collection.toJSON();
			var raw = 'count(*) as total';
			return Hospital.collection()
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
		return new this({id:id}).fetch({withRelated:'services'});
	}),
	save : Promise.method(function (data) {
		return new this(data).save();
	}),
	delete : Promise.method(function (id) {
		return new this({id:id}).destroy();
	})
});

module.exports = bookshelf.model('Hospital', Hospital);