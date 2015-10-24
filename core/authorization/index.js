function Authorization(){

};

Authorization.prototype.required = function(){
	var roles = [];
	for (var i in arguments){
		roles.push(arguments[i]);
	}
	return function(req, res, next) {
		if(roles.indexOf('all') > -1){
			return next();
		}		
		if(roles.indexOf(req.user.role.title) < 0){
			if (req.xhr){
				res.status(403);
				return res.send({success:false, message: 'You are not allowed to access this page'})
			}
			return res.render('403');
		}
		return next();
	};
};

exports = module.exports = new Authorization();