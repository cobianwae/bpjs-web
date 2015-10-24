var fs = require('fs');
var path = require('path');

function ImageConverter(options) {
	this._uploadDir = options.uploadDir;
	this._baseUrl = options.baseUrl;
	this._fileName = options.fileName;
}

ImageConverter.prototype.base64ToImage = function(photo, callback) {
	if(!photo) {
		return callback(null);
	}
	var _this = this;
	var base64Data = photo.replace(/^data:image\/png;base64,/, "");
	var name = Date.now() + '_' + Math.random() + '.png';
	var filePath = path.join(_this._uploadDir, name);
	var fileUrl = _this._baseUrl + '/' + name;
	fs.writeFile(filePath, base64Data, 'base64', function(err) {
		callback(fileUrl);
	});
}

module.exports = ImageConverter;