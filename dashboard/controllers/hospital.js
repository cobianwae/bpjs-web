var APIController = require('core/mvc').APIController;
var HospitalService = require('models/hospital');
var authorization = require('core/authorization');
var QueryBuilder = require('core/query-builder');

var hospitalController = new APIController();

hospitalController.get = function(req, res, next) {
	HospitalService.get(req.params.id)
	.then(function(model){
		res.send(model.toJSON());
	});
};
hospitalController.getList = function(req, res, next) {	
	var queryString = req.query;
	var queryBuilder = new QueryBuilder();
	queryBuilder.setup(queryString);
	HospitalService.query(queryBuilder)
	.then(function(result) {
		res.send(result);
	});
};
hospitalController.post = function(req, res, next) {
	HospitalService.save(data)
	.then(function(){
		res.send({success:true})
	});	
};
hospitalController.put = function(req, res, next) {	
	HospitalService.save(data)
	.then(function(){
		res.send({success:true})
	});	
};

hospitalController.delete = function(req, res, next) {
	HospitalService.delete(req.params.id)
	.then(function() {
		res.send({success:true});
	});
};


module.exports = hospitalController;
					