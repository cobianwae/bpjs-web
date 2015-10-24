'use strict';

angular.module('Bpjs', ['ngImgCrop', 'validation.match','angular-loading-bar', 'ngStorage', 'ngSanitize','ui.bootstrap.pagination', 'ngResource', 'ui.calendar', 'bpjs.config', 'bpjs.services', 'bpjs.directives', 'bpjs.controllers', 'ui.router'])
.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
	$httpProvider.interceptors.push([
		'$injector',
		function ($injector) {
			return $injector.get('AuthInterceptor');
		}
		]);
	$httpProvider.interceptors.push([
		'$injector',
		function ($injector) {
			return $injector.get('ErrorInterceptor');
		}
		]);
}])
.factory('AuthInterceptor', ['$window', '$q', '$injector', function ($window, $q, $injector) {
	return {
		responseError: function (response) { 
			if(response.status === 401){
				$window.location = '/account/login';
			}else if(response.status === 403){
				$('.modal').modal('hide');
				$injector.get('$state').transitionTo('forbidden');
			}
			return $q.reject(response);
		}
	};
}])
.factory('ErrorInterceptor', ['$window', '$q', '$injector', '$timeout', function ($window, $q, $injector, $timeout) {
	return {
		responseError: function (response) { 
			if(response.status === 500){
				$('.modal').modal('hide');
				$timeout(function(){$injector.get('$state').transitionTo('error');},500);
			}else if(response.status === 409 || response.status === 400){
      	// $('.modal').modal('hide');
      	$window.alert(response.data.message);
      }
      return $q.reject(response);
  }
};
}])
.run(['UserInfo', '$rootScope', 'PktYear', function(UserInfo, $rootScope,PktYear) {
	UserInfo.then(function(userInfo){
		$rootScope.userInfo = userInfo;
	});
}])
.config(['$stateProvider', '$urlRouterProvider', '$interpolateProvider', function($stateProvider, $urlRouterProvider, $interpolateProvider, UserInfo ) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
	$urlRouterProvider.otherwise('/');
}]);