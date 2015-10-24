'use strict';
angular.module('bpjs.controllers')
.controller('UserUpdateCtrl',  ['$scope', '$rootScope', 'User', '$stateParams', 'Irban', 'Jabatan', 'Role', 'Pangkat', '$state', function($scope, $rootScope, User, $stateParams, Irban, Jabatan, Role, Pangkat, $state ) {
	$scope.type = 'update';		
	$scope.model = User.get({id:$stateParams.id}, function(data){
		if($scope.model.irban_id === null) $scope.model.irban_id = '';
		if($scope.model.jabatan_id === null) $scope.model.jabatan_id = '';
	});	
	$scope.save = function() {
		if($scope.$$childHead.userForm.$valid){
			delete $scope.model.role;
			if($scope.model.irban_id === '') $scope.model.irban_id = null;
			if($scope.model.jabatan_id === '') $scope.model.jabatan_id = null;
			if($scope.model.pangkat_id === '') $scope.model.pangkat_id = null;
			User.update($scope.model, function(){
				$state.go('user');		
				$scope.model = {};
			});
		}
	}

	$scope.roles = Role.query();
	$scope.irbanCollection = Irban.query();
	$scope.jabatanCollection = Jabatan.query();
	$scope.pangkatCollection = Pangkat.query();

	$scope.changePassword = function(id) {
		$rootScope.$broadcast('changePassword', {id:id});
	}

}]);