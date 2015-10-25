var APIController = require('core/mvc').APIController;
var UserQueueService = require('models/user-queue');
var DailyQueueService = require('models/daily-queue');
var authorization = require('core/authorization');
var QueryBuilder = require('core/query-builder');
var Complaint = require('models/complaint');
var moment = require('moment');

var userQueueController = new APIController();

userQueueController.get = function(req, res, next) {
	UserQueueService.get(req.params.id)
	.then(function(model){
		res.send(model.toJSON());
	});
};
userQueueController.getList = function(req, res, next) {	
	var queryString = req.query;
	var queryBuilder = new QueryBuilder();
	queryBuilder.setup(queryString);
	queryBuilder.where({
		hospital_id : req.user.hospital_id,
		date : moment(new Date()).format('YYYY-MM-DD')
	})
	DailyQueueService.query(queryBuilder)
	.then(function(model){
		if(!model.total){
			return res.send({data:[], total:0});
		}
		var queryBuilder = new QueryBuilder();
		queryBuilder.setup(queryString);
		var dailyQueueIds = model.data.map(function(ob){
			return ob.id;
		})
		queryBuilder.includes('user');
		queryBuilder.where('daily_queue_id','in', dailyQueueIds.join(',') );
		queryBuilder.andWhere({
			is_completed : false
		})
		return 	UserQueueService.query(queryBuilder);
	})
	.then(function(result) {
		res.send(result);
	});
};
userQueueController.post = function(req, res, next) {
	UserQueueService.get(req.params.id)
	.then(function(model){
		var userQueue = model.toJSON();
		userQueue.completedAt = new Date();
		userQueue.is_completed = true;
		return 	UserQueueService.save(data);
	})
	.then(function(model){
		var userQueue = model.toJSON();
		return Complaint.getByParams({
			user_id : userQueue.user_id,
			is_completed : false
		});
	})
	.then(function(model){
		var complaint = model.toJSON();
		return Complaint.save(complaint);
	})
	.then(function(){
		res.send({success:true})
	});
};
userQueueController.put = function(req, res, next) {	
	UserQueueService.save(data)
	.then(function(){
		res.send({success:true})
	});	
};

userQueueController.delete = function(req, res, next) {
	UserQueueService.delete(req.params.id)
	.then(function() {
		res.send({success:true});
	});
};


module.exports = userQueueController;
