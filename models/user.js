var bookshelf = require('models').bookshelf,
Promise = require('core/bluebird'),
bcrypt = require('bcrypt-nodejs');
var Role = require('./role');

var User = bookshelf.Model.extend({
	tableName : 'users',
	role : function() {
		return this.belongsTo('Role');
	},
	validPassword : function(password) {
		return bcrypt.compareSync(password, this.attributes.password);
	},
},{
	get : Promise.method(function(id) {
		return new this({id:id}).fetch({withRelated : 'role'});		
	}),
	query : Promise.method(function (queryBuilder) {
		var result = {};
		var User = this;
		return this.collection()
		.query(function(qb){
			queryBuilder.build(qb);
		})
		.fetch(queryBuilder.withRelated())
		.then(function(collection){
			result.data = collection.toJSON();
			var raw = 'count(distinct(users.id)) as total';
			return User.collection()
			.query(function(qb){
				qb.select(bookshelf.knex.raw(raw));
				queryBuilder.buildConditionsOnly(qb);
			})
			.fetchOne();
		})
		.then(function(model){
			result.total = model.toJSON().total;
			return Promise.resolve(result);
		})
	}),
	save : Promise.method(function (data) {
		return new this(data).save();
	}),
	delete : Promise.method(function (id) {
		return new this({id:id}).destroy();
	}),
	getWithParams: Promise.method(function(params){
		return new this(params).fetch({withRelated : 'role'});
	}),
});

module.exports = bookshelf.model('User', User);