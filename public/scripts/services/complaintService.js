'use strict';
angular.module('bpjs.services')
.factory('Complaint', ['$resource', 'ENV', function($resource, ENV){	
	return $resource(ENV.apiEndpoint + '/dashboard/complaint/:id', {id:'@id'}, {
		update : {
			method:'PUT'
		},
		save : {
			method : 'POST'
		},
		query: {method: 'GET', isArray: false }
	});
}]);