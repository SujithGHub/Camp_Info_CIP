(function() {
	'use strict';

	angular
	.module('cip.vehicle')
	.factory('VehicleStudentFactory', VehicleStudentFactory);

	VehicleStudentFactory.$inject = [ '$resource' ,'CommonService'];

	function VehicleStudentFactory($resource,commonService) {

		return $resource( commonService.baseApi+'/vehiclestudent', {}, {
			addStudentToVehicle: {
				url:  commonService.baseApi+'/vehiclestudent/add/student',
                method: 'POST',
			},
			removeVehicleStudent: {
				url:  commonService.baseApi+'/vehiclestudent?id=:id',
                method: 'DELETE',
                params: {
                    id : '@id'
                }
			},
            getStudentByTrip: {
                url:  commonService.baseApi+'/vehiclestudent/students/trip/:id',
                method: 'GET',
                params: {
                    id : '@id'
                }
            }
		});
	}
})();