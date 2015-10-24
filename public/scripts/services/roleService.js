'use strict';
angular.module('bpjs.services')
.factory('Role', ['$resource', 'ENV', function($resource, ENV){	
	return $resource(ENV.apiEndpoint + '/dashboard/role/:id', {id:'@id'}, {
		update : {
			method:'PUT'
		},
		save : {
			method : 'POST'
		},
		query: {method: 'GET', isArray: false }
	});
}]);