function QueryBuilder(){
	this._limit = 20;
	this._conditions = {
		andWhere : [],
		orWhere : []
	};
	this._offset = 0;
	this._orderBy = 'id';
	this._orderDirection = 'desc';
	this._groupBy = '';
	this._relationsIncluded = [];
};


QueryBuilder.prototype.setup = function(options){
	this._limit = options.limit || this._limit;
	this._offset = options.page ? (parseInt(options.page) - 1) * this._limit : this._offset;
	this._orderBy = options.orderBy || this._orderBy;
	this._orderDirection = options.orderDirection || this._orderDirection;
	this._groupBy = options.groupBy || this._groupBy;
};


QueryBuilder.prototype.where = function(){
	var _this = this;
	if(arguments.length > 3 || arguments.length < 1){
		var err = new Error('invalid arguments in `where` method in QueryBuilder');
		throw err;
	}

	switch(arguments.length){
		case 3 :
		_this._conditions.where = [arguments[0], arguments[1], arguments[2]];
		break;
		case 2 :
		_this._conditions.where = { operator : arguments[1] };
		_this._conditions.where.queryObject = arguments[0];
		break;
		case 1 :
		_this._conditions.where = arguments[0];
		break;
		default :
	}
	return _this;
};

QueryBuilder.prototype.andWhere = function(){
	var _this = this;
	if(arguments.length > 3 || arguments.length < 1){
		var err = new Error('invalid arguments in `where` method in QueryBuilder');
		throw err;
	}
	switch(arguments.length){
		case 3 :
		_this._conditions.andWhere.push({condition : [arguments[0], arguments[1], arguments[2]]});
		break;
		case 2 :
		_this._conditions.andWhere.push({condition: arguments[0], operator:arguments[1]});
		break;
		case 1 :
		_this._conditions.andWhere.push({condition:arguments[0] });
		break;
		default :
	}
	return _this;
};

// QueryBuilder.prototype.orWhere = function(){
// 	var _this = this;
// 	if(arguments.length > 3 || arguments.length < 1){
// 		var err = new Error('invalid arguments in `where` method in QueryBuilder');
// 		throw err;
// 	}
// 	switch(arguments.length){
// 		case 3 :
// 		_this._conditions.orWhere = [arguments[0], arguments[1], arguments[2]];
// 		break;
// 		case 2 :
// 		_this._conditions.orWhere = { operator : arguments[1] };
// 		_this._conditions.orWhere.queryObject = arguments[0];
// 		break;
// 		case 1 :
// 		_this._conditions.orWhere = arguments[0];
// 		break;
// 		default :
// 	}
// 	return _this;
// };

// QueryBuilder.prototype.whereNot = function(queryObject, operator){

// };

// QueryBuilder.prototype.andWhereNot = function(queryObject, operator){

// };

// QueryBuilder.prototype.orWhereNot = function(queryObject, operator){

// };

// QueryBuilder.prototype.whereIn = function(queryObject, operator){

// };

// QueryBuilder.prototype.andWhereIn = function(queryObject, operator){

// };

// QueryBuilder.prototype.orWhereIn = function(queryObject, operator){

// };

QueryBuilder.prototype.buildConditionsOnly = function(qb){
	var _this = this;
	_this._mainQuery(qb);
	if ( _this._conditions.where ) {
		if (Array.isArray(_this._conditions.where) && !Array.isArray(_this._conditions.where[0]) ){
			qb.where(_this._conditions.where[0], _this._conditions.where[1], _this._conditions.where[2]);
		}else{
			if(_this._conditions.where.operator && _this._conditions.where.operator.toLowerCase() === 'or'){
				if(Array.isArray(_this._conditions.where.queryObject)){
					_this._conditions.where.queryObject.forEach(function(condition, index){
						if(index === 0){
							qb.where(condition[0], condition[1], condition[2]);
						}else{
							qb.orWhere(condition[0], condition[1], condition[2]);
						}
					});
				}else{					
					var fields = Object.keys(_this._conditions.where.queryObject);
					fields.forEach(function(field, index){
						if(index === 0){
							qb.where(field, '=', _this._conditions.where.queryObject[field]);
						}else{
							qb.orWhere(field, '=', _this._conditions.where.queryObject[field]);
						}
					});

				}
			}else{
				if(Array.isArray(_this._conditions.where)){
					_this._conditions.where.forEach(function(condition, index){
						if(index === 0){
							qb.where(condition[0], condition[1], condition[2]);
						}else{
							qb.andWhere(condition[0], condition[1], condition[2]);
						}
					});
				}else{					
					qb.where(_this._conditions.where);
				}
			}
		}
	}
	

	if (_this._conditions.andWhere.length > 0){
		for(var i in _this._conditions.andWhere){			
			var andWhere = _this._conditions.andWhere[i];
			if(Array.isArray(andWhere.condition) && !Array.isArray(andWhere.condition[0])){				
				qb.andWhere(andWhere.condition[0], andWhere.condition[1], andWhere.condition[2]);
			} else if(andWhere.operator && andWhere.operator.toLowerCase() === 'or'){
				(function(andWhere, qb){
					qb.andWhere(function(){
						var thisQ = this;
						if(Array.isArray(andWhere.condition)){
							andWhere.condition.forEach(function(condition, index){
								if(index === 0){
									//console.log(condition);
									thisQ.where(condition[0], condition[1], condition[2]);
								}else{
									//console.log(condition);
									thisQ.orWhere(condition[0], condition[1], condition[2]);
								}
							});
						}else{
							var fields = Object.keys(andWhere.condition);
							fields.forEach(function(field, index){
								if(index === 0){
									thisQ.where(field, '=', andWhere.condition[field]);
								}else{
									thisQ.orWhere(field, '=', andWhere.condition[field]);
								}
							});
						}
					});
				})(andWhere, qb);
			}else{
				(function(andWhere, qb){
					qb.andWhere(function(){
						var thisQ = this;
						if(Array.isArray(andWhere.condition)){
							andWhere.condition.forEach(function(condition, index){
								if(index === 0){
									thisQ.where(condition[0], condition[1], condition[2]);
								}else{
									thisQ.andWhere(condition[0], condition[1], condition[2]);
								}
							});
						}else{					
							thisQ.where(andWhere.condition);
						}
					});
				})(andWhere, qb);
			}
		}
	}
	return qb;
};

QueryBuilder.prototype.build = function(qb) {
	var _this = this;
	_this._selectRaw(qb);
	_this.buildConditionsOnly(qb);

	//build default setup
	qb.orderBy(_this._orderBy, _this._orderDirection);
	if(_this._limit !== 'max') {
		qb.limit(_this._limit);
	}	
	qb.offset(_this._offset);
	if ( _this._groupBy !== '') qb.groupBy(_this._groupBy);	
	return qb;
};

QueryBuilder.prototype.includes = function(){
	for(var i in arguments){
		if(this._relationsIncluded.indexOf(arguments[i]) < 0){
			this._relationsIncluded.push(arguments[i]);
		}
	}
};

QueryBuilder.prototype.withRelated = function(){
	var _this = this;
	return {withRelated : _this._relationsIncluded};
};


//to be overriden
QueryBuilder.prototype._mainQuery = function(qb){
	return qb;
};

QueryBuilder.prototype._selectRaw = function(qb){
	return qb;
};

QueryBuilder.prototype._defaultQuery = function(queryParams){
	if(typeof queryParams.is_active !== 'undefined' && !parseInt(queryParams.is_active)){
		this.where({is_active : 0});
	}else{
		this.where({is_active : 1});
	}
};

module.exports = QueryBuilder;