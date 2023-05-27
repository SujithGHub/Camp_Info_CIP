(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name VehicleRouteService
     * @module cip.vehicle
     * @require $log,
     * @description
     * VehicleRouteService
     * @author ashokrajan
     */
  
    angular
        .module('cip.vehicle')
        .service('VehicleRouteService', VehicleRouteService);

    VehicleRouteService.$inject = [
        '$log',
        'VehicleRouteFactory',
        'VehicleRouteTable',
        'CommonService'
     ];

    function VehicleRouteService($log, vehicleRouteFactory, vehicleRouteTable, commonService) {
    	
    	this.save = function(params, successCb, errorCb) {
    		vehicleRouteFactory.save(params, successCb, errorCb);
    	};
    	
    	this.update = function(params, successCb, errorCb) {
    		vehicleRouteFactory.$update(params, successCb, errorCb);
    	};
    	
    	this.delete = function(params, successCb, errorCb) {
    		vehicleRouteFactory.$delete(params, successCb, errorCb);
    	};

        this.getByRouteId = function(params, successCb, errorCb) {
            vehicleRouteFactory.getByRouteId(params, successCb, errorCb);
        };
        this.deleteRouteStop = function(params, successCb, errorCb) {
            vehicleRouteFactory.deleteRouteStop(params, successCb, errorCb);
        };
    	this.initTable = function(tableElm) {
    		commonService.setTableConfig(tableElm, vehicleRouteTable, '/vehicleroute');
    	};
    	
    }
}());
