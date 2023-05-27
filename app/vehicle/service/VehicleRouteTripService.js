(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name VehicleTripRouteService
     * @module cip.vehicle
     * @description
     *
     * VehicleTripRouteService
     * @author ashokrajan
     */
  
    angular
        .module('cip.vehicle')
        .service('VehicleTripRouteService', VehicleTripRouteService);

    VehicleTripRouteService.$inject = ['VehicleTripRouteFactory' ];

    function VehicleTripRouteService(vehicleTripRouteFactory) {
    	
    	this.deleteVehicleTripRoute = function(params, successCb, errorCb) {
    		vehicleTripRouteFactory.$delete(params, successCb, errorCb);
    	};
    }

}());
