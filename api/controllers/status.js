var APIController = require('core/mvc').APIController;
var Complaint = require('models/complaint');
var UserQueue = require('models/user-queue');
var authorization = require('core/authorization');
var QueryBuilder = require('core/query-builder');

var statusController = new APIController();

statusController.get = function(req, res, next) {
	var result = {};
	Complaint.getByParams({user_id: req.params.id, is_completed: false})
	.then(function(data){
		if(data !== null) {
			result.complaint = data.toJSON();	
			console.log('complaint');
			console.log(result.complaint);
		}
		
		
		return UserQueue.getByParams({user_id: req.params.id, is_completed: false})		
	})
	.then(function(data2){
		console.log('sininiiii');
		
		if(data2 !== null) {
			result.userQueue =data2.toJSON();
			console.log(result.userQueue);
		}	
		
		res.send(result);
		//return Promise.resolve(result);		
	})
	/*Complaint.get(req.params.id)
	.then(function(model){
		res.send(model.toJSON());
	});*/
};



module.exports = statusController;
					