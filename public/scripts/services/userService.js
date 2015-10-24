'use strict';
angular.module('bpjs.services')
.factory('User', ['$resource', 'ENV', function($resource, ENV){	
	return $resource(ENV.apiEndpoint + '/dashboard/user/:id', {id:'@id'}, {
		update : {
			method:'PUT'
		},
		save : {
			method : 'POST'
		},
		query: {method: 'GET', isArray: false }
	});
}]);