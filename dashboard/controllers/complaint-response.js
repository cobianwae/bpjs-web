var APIController = require('core/mvc').APIController;
var DailyQueue = require('models/daily-queue');
var UserQueue = require('models/user-queue');
var QueryBuilder = require('core/query-builder');
var moment = require('moment');
var Complaint = require('models/complaint');

var complaintResponseController = new APIController();

complaintResponseController.post = function(req, res, next) {
	DailyQueue.getByParams({
		hospital_id : req.body.hospital_id,
		service_id : req.body.service_id,
		date : moment(new Date()).format('YYYY-MM-DD')
	}).then(function(model){
		if(model == null){
			return DailyQueue.save({
				hospital_id : req.body.hospital_id,
				service_id : req.body.service_id,
				date : new Date(),
				progressed_number : 0,
				time_average : 0,
			})
			.then(function(modelSaved){
				var dailyQueueId = modelSaved.toJSON().id;
				return UserQueue.save({
					user_id:req.body.user_id,
					daily_queue_id : dailyQueueId,
					number:1
				});
			})
		}
		var dailyQueue = model.toJSON();
		dailyQueue.latest_number +=1;
		dailyQueue.time_average = 20;
		return DailyQueue.save(dailyQueue)
		.then(function(modelSaved){
			var dailyQueue = modelSaved.toJSON();
			return UserQueue.save({
				user_id:req.body.user_id,
				daily_queue_id : dailyQueue.id,
				number:dailyQueue.latest_number
			});
		})
		//progress number
		//dailyQueue.remains 
	})
	.then(function(model){
		var userQueue = model.toJSON();
		Complaint.getByParams({user_id:userQueue.user_id})
		.then(function(complaintModel){
			var complaint = complaintModel.toJSON();
			complaint.in_queue = 1;
			return Complaint.save(complaint);
		})
		.then(function(){
			res.send({success:true, userQueue: userQueue});
		});
	});
};

module.exports = complaintResponseController;
