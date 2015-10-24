var Handlebars = require('handlebars');
var fs = require('fs');
var pdf = require('html-pdf');
var BufferStream = require('core/buffer-stream');
var util = require('util');

function PdfGenerator(options){
	this._templateFile = options.templateFile;
	this._renderAs = options.renderAs;
	this._template = null;
	this._pdfOptions = {
		type:'pdf',
		quality : '100',
		format : options.format || 'Letter',
		orientation : options.orientation,
		filename : options.saveAs,
		header : options.header,
		footer : options.footer,
		border : options.border
	};
	//merge options here
};

PdfGenerator.prototype.generate = function(data, res){
	var _this = this;
	_this._readTemplate();
	var htmlResult = _this._setData(data);
	/*pdf.create(htmlResult, _this._pdfOptions).toBuffer(function(err, buffer){
		res.writeHead( 200, "OK", {
			"Content-Type": "application/pdf",
			"Content-Disposition": util.format("inline; filename=%s", _this._renderAs),
			// "Content-Length": buffer.length
		});
		new BufferStream( buffer )
		.pipe( res );
	});*/
	res.writeHead( 200, "OK", {
			"Content-Type": "application/pdf",
			// "Content-Disposition": util.format("inline; filename=%s", _this._renderAs),
			// "Content-Length": buffer.length
		});
	pdf.create(htmlResult, _this._pdfOptions).toStream(function(err, stream){
		console.log(err)
		stream.pipe(res);
	})

};

PdfGenerator.prototype._readTemplate = function(){
	var _this = this;
	var html = fs.readFileSync(_this._templateFile, 'utf8');
	_this._template = Handlebars.compile(html);
};

PdfGenerator.prototype._setData = function(data){
	return this._template(data);
};

module.exports = PdfGenerator;