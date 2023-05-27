(function() {
	'use strict';

	angular
	.module('cip.vehicle')
	.factory('VehicleRouteFactory', VehicleRouteFactory);

	VehicleRouteFactory.$inject = [  '$resource','CommonService' ];

	function VehicleRouteFactory($resource,commonService) {

		return $resource( commonService.baseApi+'/vehicleroute', {}, {
            $update: {
                url:  commonService.baseApi+'/vehicleroute',
                method: 'PUT'
            },
            $delete: {
                url:  commonService.baseApi+'/vehicleroute/:id',
                method: 'DELETE',
                params: {
                    id : '@id'
                }
            },
            getByRouteId: {
                url:  commonService.baseApi+'/vehicleroute/:id',
                method: 'GET',
                params: {
                    id : '@id'
                }
            },
            deleteRouteStop: {
                url:  commonService.baseApi+'/vehicleroutestop/:id',
                method: 'DELETE',
                params: {
                    id : '@id'
                }
            }
		});
	}
})();