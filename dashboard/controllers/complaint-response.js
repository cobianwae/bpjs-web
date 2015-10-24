var APIController = require('core/mvc').APIController;
var Complaint = require('models/complaintResponse');
var QueryBuilder = require('core/query-builder');

var complaintResponseController = new APIController();

complaintResponseController.post = function(req, res, next) {
	Complaint.save(data)
	.then(function(){
		res.send({success:true})
	});	
};

module.exports = complaintResponseController;
					