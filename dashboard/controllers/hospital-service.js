var APIController = require('core/mvc').APIController;
var HospitalService = require('models/hospital-service');
var authorization = require('core/authorization');
var QueryBuilder = require('core/query-builder');

var hospitalServiceController = new APIController();

hospitalServiceController.get = function(req, res, next) {
	HospitalService.get(req.params.id)
	.then(function(model){
		res.send(model.toJSON());
	});
};
hospitalServiceController.getList = function(req, res, next) {	
	var queryString = req.query;
	var queryBuilder = new QueryBuilder();
	queryBuilder.setup(queryString);
	HospitalService.query(queryBuilder)
	.then(function(result) {
		res.send(result);
	});
};
hospitalServiceController.post = function(req, res, next) {
	HospitalService.save(data)
	.then(function(){
		res.send({success:true})
	});	
};
hospitalServiceController.put = function(req, res, next) {	
	HospitalService.save(data)
	.then(function(){
		res.send({success:true})
	});	
};

hospitalServiceController.delete = function(req, res, next) {
	HospitalService.delete(req.params.id)
	.then(function() {
		res.send({success:true});
	});
};


module.exports = hospitalServiceController;
					