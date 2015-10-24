var all = require('config/env/all'),
development = require('config/env/development'),
production = require('config/env/production'),
extend = require('util')._extend,
env = process.env.NODE_ENV || 'development';

var config = {};

if (env === 'production'){
	config = extend(all, production);
}else{
	config = extend(all, development);
}

exports = module.exports = config;