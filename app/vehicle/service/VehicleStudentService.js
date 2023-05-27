(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name VehicleStudentService
     * @module cip.vehicle
     * VehicleStudentService
     * @author ashokrajan
     */
  
    angular
        .module('cip.vehicle')
        .service('VehicleStudentService', VehicleStudentService);

    VehicleStudentService.$inject = [  'VehicleStudentFactory' ];

    function VehicleStudentService(vehicleStudentFactory) {
    	
    	this.addStudentToVehicle = function(params, successCb, errorCb) {
    		vehicleStudentFactory.addStudentToVehicle(params, successCb, errorCb);
    	};
    	this.getStudentByTrip = function(params, successCb, errorCb) {
    		vehicleStudentFactory.getStudentByTrip(params, successCb, errorCb);
    	};
    	this.removeVehicleStudent = function(params, successCb, errorCb) {
    		vehicleStudentFactory.removeVehicleStudent(params, successCb, errorCb);
    	};
    }
}());
