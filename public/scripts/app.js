'use strict';

angular.module('Bpjs', ['uiGmapgoogle-maps','validation.match','angular-loading-bar', 'ngStorage', 'ngSanitize','ui.bootstrap.pagination', 'ngResource', 'bpjs.config', 'bpjs.services', 'bpjs.directives', 'bpjs.controllers', 'ui.router'])
.config(function(uiGmapGoogleMapApiProvider) {
	uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})
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
.run(['UserInfo', '$rootScope',  function(UserInfo, $rootScope) {
	UserInfo.then(function(userInfo){
		$rootScope.userInfo = userInfo;
	});
}])
.config(['$stateProvider', '$urlRouterProvider', '$interpolateProvider', function($stateProvider, $urlRouterProvider, $interpolateProvider, UserInfo ) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
	$stateProvider
	.state('user',{
		url : '/user',
		templateUrl : '/templates/user/list.html',
		controller : 'UserListCtrl'
	})
	.state('user-create', {
		url: '/user/create',
		templateUrl: '/templates/user/create.html',
		controller: 'UserCreateCtrl'
	})
	.state('user-update', {
		url: '/user/update/:id',
		templateUrl: '/templates/user/update.html',
		controller: 'UserUpdateCtrl'
	})
	.state('complaint',{
		url : '/complaint',
		templateUrl : '/templates/complaint/list.html',
		controller : 'ComplaintListCtrl'
	})
	.state('complaint-response',{
		url : '/complaint/response/:id',
		templateUrl : '/templates/complaint/response.html',
		controller : 'ComplaintResponseCtrl'
	})
	.state('user-queue',{
		url : '/userqueue',
		templateUrl : '/templates/queue/list.html',
		controller : 'UserQueueListCtrl'
	});

	$urlRouterProvider.otherwise('/');
}]);