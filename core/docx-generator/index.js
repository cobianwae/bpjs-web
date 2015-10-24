var Promise = require('bluebird'),
fs = require('fs'),
DocxTemplater = require('docxtemplater'),
xml2js =  require('xml2js'),
parseString = Promise.promisify(xml2js.parseString),
BufferStream = require('core/buffer-stream'),
util = require('util');


function DocxGenerator(options){
	this._templateFile = options.templateFile;
	this._renderAs = options.renderAs;
};

DocxGenerator.prototype.generate = function (data, res){
	console.log('--------------------------------------------------------------');
	console.log(data);
	var _this = this;
	var rawData = _this._setData(data);
	_this._setHmtlContentType(rawData.docxZip)
	.then(function(docxZip){
		return 	_this._setHmlRels(docxZip, rawData.htmlRels);
	})
	.then(function(docxZip){
		_this._importHtmlContent(docxZip, rawData.htmlContents);
		return _this._renderFile(docxZip, res);
	});
};

DocxGenerator.prototype._setData = function(data){
	var _this = this;
	var template = fs.readFileSync(_this._templateFile, 'binary');
	var docx = new DocxTemplater(template);
	var htmlIndex = {id : 0};
	var htmlRels = [];
	var htmlContents = [];
	var convertedData = {};
	docx.setData(_this._convertData(data, convertedData, htmlIndex, htmlRels, htmlContents));

	docx.render();
	console.log(htmlRels);
	console.log(htmlContents);
	return {
		docxZip : docx.getZip(),
		htmlRels : htmlRels,
		htmlContents : htmlContents
	};
};


DocxGenerator.prototype._convertData = function(data, convertedData, htmlIndex, htmlRels, htmlContents){
	var _this = this;
	if(typeof data === 'string'){
		return data;
	}
	var dataKeys = Object.keys(data);
	console.log(data);
	dataKeys.forEach(function(key){
		if(!data[key]){
			console.log(key);
			return;
		}
		if(typeof data[key] !== 'object'){
			convertedData[key] = data[key];
		}else if(Array.isArray(data[key])){
			convertedData[key] = [];
			data[key].forEach(function(deeperData){
				convertedData[key].push(_this._convertData(deeperData, {}, htmlIndex, htmlRels, htmlContents));
				
			})
		}else{

			if(data[key].hasOwnProperty('isHtml') && data[key]['isHtml']){
				var htmlKey = 'html_' + htmlIndex.id;
				htmlContents[htmlKey] = data[key].data;
				htmlRels.push({'$' :  {
					Id : htmlKey,
					Type : 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/aFChunk',
					Target : util.format('/word/%s.htm', htmlKey)
				}});
				convertedData[key] = util.format('<w:altChunk r:id="%s" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" />', htmlKey);
				htmlIndex.id++;
			}else{
				convertedData[key] = _this._convertData(data[key], {}, htmlIndex, htmlRels, htmlContents);
			}
		}
	});
	console.log(convertedData);
	return convertedData;
}

DocxGenerator.prototype._setHmtlContentType = Promise.method(function(docxZip){
	var contentType = {'$' : {
		Extension : 'htm',
		ContentType : 'text/html'
	}};

	return parseString(docxZip.file('[Content_Types].xml').asText())
	.then(function(content){
		var docxContentTypeObject = content;
		docxContentTypeObject.Types.Default.push(contentType);
		var xmlBuilder = new xml2js.Builder();
		var newDocxContentTypeObject = xmlBuilder.buildObject(docxContentTypeObject);
		docxZip.file('[Content_Types].xml', newDocxContentTypeObject);
		return docxZip;
	});
});

DocxGenerator.prototype._setHmlRels = Promise.method(function(docxZip, htmlRels){
	var docxRels = docxZip.file('word/_rels/document.xml.rels').asText();
	return parseString(docxRels).then(function(content){
		var docxRelsObject = content;
		htmlRels.forEach(function(htmlRel){
			docxRelsObject.Relationships.Relationship.push(htmlRel);
		})
		var xmlBuilder = new xml2js.Builder();
		var newDocxRelsObject = xmlBuilder.buildObject(docxRelsObject);
		docxZip.file('word/_rels/document.xml.rels', newDocxRelsObject);
		return docxZip;
	});
});

DocxGenerator.prototype._importHtmlContent = function(docxZip, htmlContents){
	var htmlKeys = Object.keys(htmlContents);
	htmlKeys.forEach(function(htmlKey){
		docxZip.file(util.format('word/%s.htm', htmlKey), util.format('<!DOCTYPE html><html><head><style>p{margin:0}</style></head><body>%s</body></html>', htmlContents[htmlKey]));
		return docxZip;
	});
};

DocxGenerator.prototype._renderFile = function(docxZip, res){
	var _this = this;
	var output = docxZip.generate({type:'nodebuffer'});
	res.writeHead( 200, "OK", {
		"Content-Type": "application/msword",
		"Content-Disposition": util.format("inline; filename=%s", _this._renderAs),
		"Content-Length": output.length
	});


	new BufferStream( output )
	.pipe( res );
};

module.exports = DocxGenerator;