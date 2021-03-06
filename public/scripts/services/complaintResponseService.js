'use strict';
angular.module('bpjs.services')
.factory('ComplaintResponse', ['$resource', 'ENV', function($resource, ENV){	
	return $resource(ENV.apiEndpoint + '/dashboard/complaintresponse/:id', {id:'@id'}, {
		update : {
			method:'PUT'
		},
		save : {
			method : 'POST'
		},
		query: {method: 'GET', isArray: false }
	});
}]);