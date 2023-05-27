(function() {
	'use strict';

	angular
	.module('cip.vehicle')
	.factory('VehicleTripRouteFactory', VehicleTripRouteFactory);

	VehicleTripRouteFactory.$inject = [ '$resource','CommonService'];

	function VehicleTripRouteFactory($resource,commonService) {

		return $resource( commonService.baseApi+'/vehicleroutetrip', {}, {
			$delete: {
				url:  commonService.baseApi+'/vehicleroutetrip/:id',
                method: 'DELETE',
                params: {
					id : '@id'
				}
			}
		});
	}
})();