var APIController = require('core/mvc').APIController;
var User = require('models/user');
var authorization = require('core/authorization');
var QueryBuilder = require('core/query-builder');
var jwt = require('core/authentication/jwt');

var authenticationController = new APIController();

authenticationController.post = function(req, res, next) {
	User.getWithParams({
		bpjs_number : req.body.bpjs_number
	})
	.then(function(model){
		if (model === null) {
			return res.send({success:false, message: 'nomor BPJS tidak terdaftar'});
		}
		if(!model.validPassword(req.body.password)) {
			return res.send({success:false, message: 'password salah'});
		}
		var user = model.toJSON();
		var token = jwt.generateToken({
			id : user.id,
			bpjs_number : user.bpjs_number,
			identity_number : user.identity_number
		});
		res.send({success:true, token : token, user_id:user.id});
	});	
};

module.exports = authenticationController;
