'use strict';
angular.module('bpjs.controllers')
.controller('UserListCtrl',  ['$scope', '$rootScope', 'User', function($scope, $rootScope, User) {

	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.pageSize = 20;
	$scope.total = 0;

	var refresh = function(){
		$scope.userQueryResult = User.query({limit: $scope.pageSize}, function(){
			$scope.total = $scope.userQueryResult.total;
			$scope.currentPage = 1;
		});
	};
	refresh();

	$scope.remove = function(id) {
		if (confirm('Are you sure you want to delete this?')) {
			User.delete({id:id}, function() {
				refresh();
			})
		}
	};
	
	$scope.update = function(id) {
		$rootScope.$broadcast('user-update', {id:id});
	}	
	
	$scope.$on('user-created', function(event, args) {
		refresh();
	});
	
	$scope.$on('user-updated', function(event, args) {
		refresh();
	});
	
	$scope.pageChanged = function() {
		$scope.userQueryResult = User.query({page : $scope.currentPage, limit: $scope.pageSize});		
	};

}]);