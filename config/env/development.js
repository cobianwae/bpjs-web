var path = require('path');
var roothPath = path.normalize(__dirname + '/../..');
var config = {
	port:9090,
	ipAddress :'127.0.0.1',
	database : {
		client: 'mysql',
		connection: {
			host     : '127.0.0.1',
			user     : 'root',
			password : '',
			database : 'bpjsdb',
			charset  : 'utf8',
			debug: ['ComQueryPacket']
		}
	},
	redis : { 
		host : '127.0.0.1', 
		port : '6379',
	},
	baseUploadPath : path.join(roothPath, 'public/uploads')
};

exports = module.exports = config;
