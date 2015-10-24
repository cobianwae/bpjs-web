var APIController = require('core/mvc').APIController;
var Complaint = require('models/complaint');

var complaintController = new APIController();

complaintController.post = function(req, res, next) {
	req.body.date = new Date(req.body.date);
	req.body.user_id = req.user.id;
	req.body.created_at = new Date();
	Complaint.save(req.body)
	.then(function(model){
		res.send({success:true});
	});
};

module.exports = complaintController;
