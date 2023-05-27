(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name VehicleService
     * @module cip.vehicle
     * @require $log,
     * @description
     *
     * VehicleService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.vehicle')
        .service('VehicleService', VehicleService);

    VehicleService.$inject = [
        '$log',
        'VehicleFactory',
        'VehicleTable',
        'CommonService'
     ];

    function VehicleService($log, vehicleFactory, vehicleTable, commonService) {
    	
    	this.saveVehicle = function(params, successCb, errorCb) {
    		vehicleFactory.save(params, successCb, errorCb);
    	};
    	
    	this.updateVehicle = function(params, successCb, errorCb) {
    		vehicleFactory.$update(params, successCb, errorCb);
    	};
    	
    	this.deleteVehicle = function(params, successCb, errorCb) {
    		vehicleFactory.$delete(params, successCb, errorCb);
    	};
    	
    	this.getVehicleTypes = function(params, successCb, errorCb) {
    		vehicleFactory.getVehicleTypes(params, successCb, errorCb);
    	};
    	
    	this.getByVehicleId = function(params, successCb, errorCb) {
    		vehicleFactory.getByVehicleId(params, successCb, errorCb);
    	};
    	
    	this.getStudentsByVehicleId = function(params, successCb, errorCb) {
    		vehicleFactory.getStudentsByVehicleId(params, successCb, errorCb);
    	};

        this.getLatestLocationByTripId=function(params, successCb, errorCb) {
            vehicleFactory.getLatestLocationByTripId(params, successCb, errorCb);
        }
    	
    	this.initTable=function(tableElm) {
    		commonService.setTableConfig(tableElm, vehicleTable, '/vehicle');
    	};

    }

}());
