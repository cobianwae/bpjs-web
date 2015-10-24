var dateHelpers = require('core/helpers/date.js');
var helpers = {};

helpers.dateHelpers = dateHelpers;
helpers.numberingList = function  (i) {
	return (parseInt(i) + 1).toString();
}
helpers.lhpHelpers = {};
helpers.lhpHelpers.toString = function(content, templateContent) {	
	if(content !== undefined) {
		if(content.slice(0, 3) === "<p>") {
			return content.slice(0, 3) +  " " + templateContent + " " + content.slice(3);		
		}		
		return templateContent + " " + content;
	} 
}
helpers.statisticHelpers = {};
helpers.statisticHelpers.getStatisticValue = function(type, nhpDisetujui, lhpDisetujui, iconOk) {	
	var icon = '<img src="'+iconOk+'" style="text-align:center"/>';
	switch(type) {
		case 'not-finished':
			if(nhpDisetujui != 1 && lhpDisetujui != 1) {
				return icon;
			}
			break;
		case 'in-progress':
			if(nhpDisetujui == 1 && lhpDisetujui != 1) {
				return icon;
			}
			break;
		case 'finished':
			if(nhpDisetujui == 1 && lhpDisetujui == 1) {
				return icon;
			}
			break;
	}

	return "";

}
module.exports = helpers;