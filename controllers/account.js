var Controller = require('core/mvc').Controller;
var Authentication = require('core/authentication');

var accountController = new Controller();

accountController.getLogin = function(req, res, next) {
	res.render('account/login',{
		title : 'Login',
		pageClass : 'login-page',
		message : req.flash('message')
	});
};

accountController.postLogin = Authentication.authenticate('local', {
	successRedirect : '/dashboard',
	failureRedirect : '/account/login',
	failureFlash: true 
});

accountController.getLogout = function(req, res, next) {
	req.logout();
	res.redirect('/account/login');
};

module.exports = accountController;