var passport = require('passport'),
PassportLocal = require('passport-local').Strategy,
User = require('models/user');

function LocalStrategy(){}

LocalStrategy.prototype.initialize = function(){
	passport.use('local',new PassportLocal({ passReqToCallback : true},	function(req, username, password, done) {
		User.getWithParams({ username:username })
		.then(function(model) {
			if (model === null) {
				return done(null, false, req.flash('message','Incorrect username'));
			}
			if(!model.validPassword(password)) {
				return done(null, false, req.flash('message','Incorrect password' ));
			}
			var user = model.toJSON();
			return done(null, user);
		})
		.catch(function(err){
			return done(err);
		});
	}));
};

exports = module.exports = new LocalStrategy();
