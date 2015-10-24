var APIController = require('core/mvc').APIController;
var DailyQueue = require('models/daily-queue');
var UserQueue = require('models/user-queue');
var QueryBuilder = require('core/query-builder');

var complaintResponseController = new APIController();

complaintResponseController.post = function(req, res, next) {
	Complaint.save(data)
	.then(function(){
		res.send({success:true})
	});	
};

module.exports = complaintResponseController;
					