var APIController = require('core/mvc').APIController;
var Complaint = require('models/complaint');
var Hospital = require('models/hospital');
var QueryBuilder = require('core/query-builder');
var HospitalQueryBuilder = require('lib/hospital/query-builder');

var complaintController = new APIController();

complaintController.get = function(req, res, next) {
	Complaint.get(req.params.id)
	.then(function(model){
		var complaint = model.toJSON();
		var userGeoLoc = complaint.location_reference == 'address' ? ['-6.902505', '107.618761'] : complaint.location_reference.split(',');
		complaint.location_reference = userGeoLoc.join(',');
		var hospitalQueryBuilder = new HospitalQueryBuilder({
			centerLat : userGeoLoc[0],
			centerLang : userGeoLoc[1]
		});
		Hospital.queryNearbyHospitals(hospitalQueryBuilder)
		.then(function(collection){
			complaint.nearbyHospitals = collection.toJSON(); 
			res.send(complaint);			
		})
	});
};
complaintController.getList = function(req, res, next) {	
	var queryString = req.query;
	var queryBuilder = new QueryBuilder();
	queryString.limit = 20;
	queryString.orderBy = 'created_at';
	queryString.orderDirection = 'desc'
	queryBuilder.includes('user');;
	queryBuilder.setup(queryString);
	queryBuilder.where({
		in_queue:0
	});
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
