var path = require('path'),
rootPath = path.normalize(__dirname + '/../..'),
publicPath = path.join(rootPath, 'public');


var config = {
	rootPath : rootPath,
	publicPath : publicPath,
	jwtSecreetKey : 'hackaton-merdeka-6414'
};

exports = module.exports = config;