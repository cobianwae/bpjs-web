'use strict';
angular.module('bpjs.controllers')
.controller('UserQueueListCtrl',  ['$scope', '$rootScope', 'UserQueue', function($scope, $rootScope, UserQueue) {


	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.pageSize = 20;
	$scope.total = 0;

	var refresh = function(){
		$scope.userqueueQueryResult = UserQueue.query({limit: $scope.pageSize}, function(){
			$scope.total = $scope.userqueueQueryResult.total;
			$scope.currentPage = 1;
		});
	};
	refresh();

	$scope.remove = function(id) {
		if (confirm('Are you sure you want to delete this?')) {
			UserQueue.delete({id:id}, function() {
				refresh();
			})
		}
	};
	
	$scope.update = function(id) {
		$rootScope.$broadcast('userqueue-update', {id:id});
	}	
	
	$scope.$on('userqueue-created', function(event, args) {
		refresh();
	});
	
	$scope.$on('userqueue-updated', function(event, args) {
		refresh();
	});
	
	$scope.pageChanged = function() {
		$scope.userqueueQueryResult = UserQueue.query({page : $scope.currentPage, limit: $scope.pageSize});		
	};


	$scope.process = function(id){
		UserQueue.save({id : id}, function(){
			refresh();
		})
	}


}]);