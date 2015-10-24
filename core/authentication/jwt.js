var jwt = require('jsonwebtoken');
var config = require('config');
var expressJwt = require('express-jwt');

function Jwt(){

};

Jwt.prototype.generateToken = function(userProfile){
	return jwt.sign(userProfile,config.jwtSecreetKey);
};

Jwt.prototype.authenticate = function(){
	return expressJwt({secret : config.jwtSecreetKey});
};

Jwt.prototype.authenticateWithExceptions = function(exceptions){
	return this._allows(this.authenticate(), exceptions);
};

Jwt.prototype._allows = function(parent, allows){
	return function(req, res, next){
		var url  = req.url;
		for(var i in allows){
			if(allows[i].path instanceof RegExp){
				if(url.match(allows[i].path) !== null && req.method.toLowerCase() === allows[i].method.toLowerCase()){
					return next();
				}
			}
			if(url === allows[i].path && req.method.toLowerCase() === allows[i].method.toLowerCase()){
				return next();
			}
		}
		parent(req, res, next);
	}
};

exports = module.exports = new Jwt();