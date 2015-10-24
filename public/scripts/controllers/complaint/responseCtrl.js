'use strict';
angular.module('bpjs.controllers')
.controller('ComplaintResponseCtrl',  ['$scope', '$rootScope', 'ComplaintResponse', 'HospitalService','Complaint', 'Hospital','$stateParams' , 'uiGmapGoogleMapApi',
	function($scope, $rootScope, ComplaintResponse, HospitalService, Complaint, Hospital, $stateParams, uiGmapGoogleMapApi) {

		
		$scope.model = {};
		$scope.hospitalMarkers = [];
		$scope.hospitalServiceQueryResult = HospitalService.query({limit:'max'}, function(){
			console.log($scope.hospitalServiceQueryResult.data);
		});
		$scope.options = {
			scrollwheel: false
		};

		$scope.save = function(){				
			if($scope.$$childHead.complaintResponseForm.$valid){			
				ComplaintResponse.save($scope.model, function(){
					$state.go('complaint');				
					$scope.complaint = {};
					$scope.model = {};
					
				});
			}
		};
		$scope.complaint = Complaint.get({id:$stateParams.id}, function(){
			$scope.userGeoLoc = $scope.complaint.location_reference.split(',');
			uiGmapGoogleMapApi.then(function(maps) {
				$scope.map = { center: { latitude: $scope.userGeoLoc[0], longitude: $scope.userGeoLoc[1] }, zoom: 13 };
				$scope.hospitalMarkers.push({
					latitude: $scope.userGeoLoc[0], 
					longitude:  $scope.userGeoLoc[1],
					id : 0,
					title : 'User Location'
				});
				for(var i in $scope.complaint.nearbyHospitals){
					$scope.hospitalMarkers.push({
						latitude: $scope.complaint.nearbyHospitals[i].lat, 
						longitude: $scope.complaint.nearbyHospitals[i].lang,
						icon : '/public/images/hospital-marker.png',
						id : $scope.complaint.nearbyHospitals[i].id,
						title : $scope.complaint.nearbyHospitals[i].name
					});
				}
				
			});

		});

		$scope.chooseHospital = function(a, b, marker){
			if(marker.id != 0){
				$scope.model.hospital_id = marker.id;
				$scope.complaint.hospital = marker.title;
				Hospital.get({id:marker.id}, function(data){
					$scope.hospitalServiceQueryResult.data = data.services;
				});
			}
		};

	}]);