var QueryBuilder = require('core/query-builder');
var util = require('util');

var bookshelf = require('models').bookshelf;
var Hospital = require('models/hospital');

function HospitalQueryBuilder(options){
	QueryBuilder.call(this, options);
	this.includes('address');
	this.setup({orderBy:'distance'});
	this._centerLat = options.centerLat;
	this._centerLang = options.centerLang;
};

util.inherits(HospitalQueryBuilder, QueryBuilder);

HospitalQueryBuilder.prototype._selectRaw = function(qb){	
	qb.select(bookshelf.knex.raw(util.format("hospitals.*, ( 6371 * acos( cos( radians(%s) ) * cos( radians( lat ) ) * cos( radians( lang ) - radians(%s) ) + sin( radians(%s) ) * sin( radians( lat ) ) ) ) AS distance", this._centerLat, this._centerLang, this._centerLat)));
	return qb;
};

HospitalQueryBuilder.prototype._mainQuery = function(qb){
	qb.having('distance', '<', 25)
	return qb;
};

HospitalQueryBuilder.prototype.query = function(queryParams){
};

module.exports = HospitalQueryBuilder;