'use strict';
angular.module('bpjs.services')
.factory('UserInfo', ['User', '$sessionStorage', '$q', function(User, $sessionStorage, $q){
	var deferred = $q.defer();
	var userInfo = {};
	User.get({id:0, current_user:true},function(user){
		userInfo = user;
		deferred.resolve(userInfo);
	});
	return deferred.promise;
}]);