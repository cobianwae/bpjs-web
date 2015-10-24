'use strict';
angular.module('bpjs.controllers')
.controller('ComplaintResponseCtrl',  ['$scope', '$rootScope', 'ComplaintResponse', '$state' ,  function($scope, $rootScope, ComplaintResponse, $state) {
	$scope.type = 'create';
	$scope.model = {};
	$scope.save = function(){				
		if($scope.$$childHead.userForm.$valid){			
			if($scope.model.irban_id === '') $scope.model.irban_id = null;

			User.save($scope.model, function(){
				$state.go('user');				
				$scope.model = {};
			});
		}
	};

	$scope.roles = Role.query();
}]);