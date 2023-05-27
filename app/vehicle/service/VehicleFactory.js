(function() {
	'use strict';

	angular
	.module('cip.vehicle')
	.factory('VehicleFactory', VehicleFactory);

	VehicleFactory.$inject = [
	                             '$resource',
		'CommonService'
	                             ];

	function VehicleFactory($resource,commonService) {

		return $resource( commonService.baseApi+'/vehicle', {}, {
			$update: {
				url:  commonService.baseApi+'/vehicle',
				method: 'PUT'
			},
			$delete: {
                url:  commonService.baseApi+'/vehicle/delete',
                method: 'PUT'
            },
			getVehicleTypes: {
				url:  commonService.baseApi+'/vehicle/types',
                method: 'GET',
                isArray:true
			},
			getStudentsByVehicleId: {
				url:  commonService.baseApi+'/vehicle/getStudentsByVehicleId?id=:id',
				params: {
					id : '@id'
				},
                method: 'GET',
                isArray:true
			},
			removeStudent: {
				url:  commonService.baseApi+'/vehicle/removeStudent',
				method: 'PUT'
			},
			getByVehicleId: {
				url:  commonService.baseApi+'/vehicle/:id',
                method: 'GET',
                params: {
					id : '@id'
				},
			},
            getLatestLocationByTripId: {
                url:  commonService.baseApi+'/vehicleroutetrip/latest/location/:id',
                method: 'GET',
                params: {
                    id : '@id'
                },
            }
		});
	}
})();