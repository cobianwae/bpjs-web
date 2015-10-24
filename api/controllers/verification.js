var APIController = require('core/mvc').APIController;
var User = require('models/user');
var jwt = require('core/authentication/jwt');

var verificationController = new APIController();

verificationController.post = function(req, res, next) {
	User.getWithParams({
		id : req.body.user_id
	})
	.then(function(model){
		var user = model.toJSON();
		console.log(user);
		if(user.identity_number.slice( -3 ) === req.body.identity_number_end){
			var token = jwt.generateToken({
				id : user.id,
				bpjs_number : user.bpjs_number,
				identity_number : user.identity_number
			});
			return res.send({success:true, token : token, user_id:user.id});
		}
		res.send({success:false, message: "kartu identitas tidak cocok"});
	});	
};

module.exports = verificationController;
