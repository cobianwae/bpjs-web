require('app-module-path').addPath(__dirname);
var domain = require('domain');
var express = require('express');
var app = express();
var mvc = require('./core/mvc');
var authentication = require('./core/authentication');
var path = require('path');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var config = require('config');
var env = process.env.NODE_ENV || 'development';
var handlebarsHelpers = require('core/helpers/handlebars.js');
var jwt = require('core/authentication/jwt');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
	extended: true,
	limit: '50mb'
}));
app.use(cookieParser());
app.use(compress());

app.use(function(req, res, next){
	var reqDomain = domain.create();
	reqDomain.add(req);
	reqDomain.add(res);
	reqDomain.on('error', function(err){
		console.log(err.stack);
		if (req.xhr){
			res.status(500);
			return res.send({success:false, message: 'something error occured'});
		}
	});
	reqDomain.run(next);
});

//authentication block
authentication.initialize(app);
app.use(flash());
app.use('/dashboard', authentication.required);
app.use('/public/uploads', authentication.required);
app.use('/api', jwt.authenticateWithExceptions([
	{path : '/authentication', method:'post'},
	{path : '/verification', method:'post'},
	{path : '/user', method:'post'},
	{path : '/home', method:'get'}]));

//static block;
app.use('/public',express.static(__dirname + '/public'));
if(env == 'production'){
	app.use('/public/uploads', express.static(__dirname + '/../data'));
}
// app.use(express.static(__dirname + '/public/ckeditor'));
app.use('/bower_components',express.static(__dirname + '/bower_components'));
//angular templates
app.use('/templates', express.static(__dirname + '/public/templates'));

//mvc block;
mvc.init(app, {
	dir : __dirname,
	home : {controller : 'home', action: 'index'},
	modules : [{
		name : 'dashboard',
		prefix : 'dashboard',
		dir : path.join(__dirname, 'dashboard'),
		home : {controller: 'dashboard', action: 'index'}
	},{
		name : 'api',
		prefix : 'api',
		dir : path.join(__dirname, 'api'),
		home : {controller: 'home', action: 'index'}
	}],
	handlebarsHelpers : handlebarsHelpers
});


app.listen(config.port, config.ipAddress, function(){
	console.log("Listening on %s, server_port %s", config.ipAddress, config.port);
});