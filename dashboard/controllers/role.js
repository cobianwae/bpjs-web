var APIController = require('core/mvc').APIController;
var Role = require('models/role');
var authorization = require('core/authorization');
var QueryBuilder = require('core/query-builder');

var roleController = new APIController();

roleController.get = function(req, res, next) {
	Role.get(req.params.id)
	.then(function(model){
		res.send(model.toJSON());
	});
};
roleController.getList = function(req, res, next) {	
	var queryString = req.query;
	var queryBuilder = new QueryBuilder();
	queryString.limit = 20;
	queryBuilder.setup(queryString);
	Role.query(queryBuilder)
	.then(function(result) {
		res.send(result);
	});
};
roleController.post = function(req, res, next) {
	Role.save(data)
	.then(function(){
		res.send({success:true})
	});	
};
roleController.put = function(req, res, next) {	
	Role.save(data)
	.then(function(){
		res.send({success:true})
	});	
};

roleController.delete = function(req, res, next) {
	Role.delete(req.params.id)
	.then(function() {
		res.send({success:true});
	});
};


module.exports = roleController;
					