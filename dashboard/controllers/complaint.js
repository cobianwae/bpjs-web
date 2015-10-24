var APIController = require('core/mvc').APIController;
var Complaint = require('models/complaint');
var QueryBuilder = require('core/query-builder');

var complaintController = new APIController();

complaintController.get = function(req, res, next) {
	Complaint.get(req.params.id)
	.then(function(model){
		res.send(model.toJSON());
	});
};
complaintController.getList = function(req, res, next) {	
	var queryString = req.query;
	var queryBuilder = new QueryBuilder();
	queryString.limit = 20;
	queryString.orderBy = 'created_at';
	queryString.orderDirection = 'desc';
	queryBuilder.setup(queryString);
	queryBuilder.includes('user');
	Complaint.query(queryBuilder)
	.then(function(result) {
		res.send(result);
	});
};
complaintController.post = function(req, res, next) {
	Complaint.save(data)
	.then(function(){
		res.send({success:true})
	});	
};
complaintController.put = function(req, res, next) {	
	Complaint.save(data)
	.then(function(){
		res.send({success:true})
	});	
};

complaintController.delete = function(req, res, next) {
	Complaint.delete(req.params.id)
	.then(function() {
		res.send({success:true});
	});
};


module.exports = complaintController;
					