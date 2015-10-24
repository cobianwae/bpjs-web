'use strict';
angular.module('bpjs.controllers')
.controller('ComplaintListCtrl',  ['$scope', '$rootScope', 'Complaint', function($scope, $rootScope, Complaint) {

	console.log(new Date());

	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.pageSize = 20;
	$scope.total = 0;

	var refresh = function(){
		$scope.complaintQueryResult = Complaint.query({limit: $scope.pageSize}, function(){
			$scope.total = $scope.complaintQueryResult.total;
			$scope.currentPage = 1;
		});
	};
	refresh();

	$scope.remove = function(id) {
		if (confirm('Are you sure you want to delete this?')) {
			Complaint.delete({id:id}, function() {
				refresh();
			})
		}
	};
	
	$scope.update = function(id) {
		$rootScope.$broadcast('complaint-update', {id:id});
	}	
	
	$scope.$on('complaint-created', function(event, args) {
		refresh();
	});
	
	$scope.$on('complaint-updated', function(event, args) {
		refresh();
	});
	
	$scope.pageChanged = function() {
		$scope.complaintQueryResult = Complaint.query({page : $scope.currentPage, limit: $scope.pageSize});		
	};

}]);