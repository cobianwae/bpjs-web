'use strict';
angular.module('bpjs.controllers')
.controller('UserCreateCtrl',  ['$scope', '$rootScope', 'User', 'Role','$state' ,  function($scope, $rootScope, User, Role, $state) {
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