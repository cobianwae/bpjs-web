var APIController = require('core/mvc').APIController;
//var Status = require('models/status');
var UserQueue = require('models/user-queue');
var authorization = require('core/authorization');
var QueryBuilder = require('core/query-builder');

var statusController = new APIController();

statusController.get = function(req, res, next) {
	var result = {};
	Complaint.getByParams({user_id: req.params.id, is_completed: true})
	.then(function(data){
		result.complaint = data;
		UserQueue.getByParams({user_id: req.params.id})
		.then(function(data2){
			if(data2 !== null) {
				result.userQueue =data2.toJSON();
			}	
			return Promise.resolve(result);		
		})
	})
	/*Complaint.get(req.params.id)
	.then(function(model){
		res.send(model.toJSON());
	});*/
};



module.exports = statusController;
					