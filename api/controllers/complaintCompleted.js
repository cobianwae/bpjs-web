var APIController = require('core/mvc').APIController;
var Complaint = require('models/complaint');

var complaintCompletedController = new APIController();

complaintCompletedController.get = function(req, res, next) {	
	Complaint.getByParams({user_id: req.params.id, is_completed: true})
	.then(function(model){		
		if(model === null) {
			res.send({success: true, status: "in_progress"});	
		} else {
			res.send({success: true, status: "completed"});	
		}
		
	});
};

module.exports = complaintCompletedController;
