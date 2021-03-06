var APIController = require('core/mvc').APIController;
var User = require('models/user');
var authorization = require('core/authorization');
var QueryBuilder = require('core/query-builder');
var mapper = require('core/helpers/mapper');
var bcrypt =require('bcrypt-nodejs');
var userController = new APIController();

// userController.get = function(req, res, next) {
// 	var id = req.params.id;
// 	if(req.query.current_user === 'true'){
// 		id = req.user.id;
// 	}		
// 	User.get(id)
// 	.then(function(model){
// 		var userViewModel = model.toJSON();
// 		res.send(userViewModel);
// 	});
// };
// userController.getList = function(req, res, next) {		
// 	var queryParams = req.query;
// 	var queryBuilder = new QueryBuilder();
// 	queryBuilder.setup(queryParams);
// 	User.query(queryBuilder)
// 	.then(function(result) {						
// 		res.send(result);
// 	});
// };
userController.post = function(req, res, next) {
	if(req.body.password !== req.body.confirm_password){
		return res.send({success:false, message:"password didn't match"});
	}
	var address = null;
	User.getWithParams({bpjs_number : req.body.bpjs_number})
	.then(function(model){
		if(model == null){
			return res.send({success:false, message: 'Nomor BPJS tidak terdaftar'});
		}
		var user = model.toJSON();
		if(user.is_active){
			return res.send({success:false, message: 'Nomor BPJS terdaftar telah terverifikasi'});
		}
		var salt = bcrypt.genSaltSync(5);
		var hash = bcrypt.hashSync('hagemaru', salt, null);
		user.password = hash;
		address = user.address;
		delete user.address;
		return User.save(user);
	})
	.then(function(user){
		user.address = address;

		res.send({success:true, user:user, address: address});
	});	
};
// userController.put = function(req, res, next) {
// 	User.save(req.body)
// 	.then(function(){
// 		res.send({success:true})
// 	});	
// };

// userController.delete = function(req, res, next) {
// 	User.delete(req.params.id)
// 	.then(function() {
// 		res.send({success:true});
// 	});
// };


module.exports = userController;