'use strict';
angular.module('bpjs.services')
.factory('UserQueue', ['$resource', 'ENV', function($resource, ENV){	
	return $resource(ENV.apiEndpoint + '/dashboard/userqueue/:id', {id:'@id'}, {
		update : {
			method:'PUT'
		},
		save : {
			method : 'POST'
		},
		query: {method: 'GET', isArray: false }
	});
}]);