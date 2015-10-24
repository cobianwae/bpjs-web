var mapper = {};

mapper.clearEmptyData = function(reqBody) {
	var fields = Object.keys(reqBody);
	var data = {};
	fields.forEach(function(field){		
		if(reqBody[field].trim() !== ''){
			data[field] = reqBody[field];
		} 
	});
	return data;	
}

module.exports = mapper;