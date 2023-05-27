(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name AttendanceService
     * @module cip.attendance
     * @require $log,
     * @description
     *
     * AttendanceService
     *
     * @author Deepa
     * @copyright
     */
  
    angular
        .module('cip.attendance')
        .service('AttendanceService', AttendanceService);

    AttendanceService.$inject = [
        '$log',
        'AttendanceFactory',
     ];

    function AttendanceService($log,attendanceFactory) {
    	this.getClassList = function(successCb,errorCb){
    		attendanceFactory.getClassList(successCb,errorCb);
    	};
    	this.getStudentList = function(params,successCb,errorCb){
    		attendanceFactory.getStudentList(params,successCb,errorCb);
    	};
    	this.saveAttendance = function(params,successCb,errorCb){
    		attendanceFactory.saveAttendance(params,successCb,errorCb);
    	};
    	this.updateAttendanceAndCorrectionRequest = function(params,successCb,errorCb){
    		attendanceFactory.updateAttendanceAndCorrectionRequest(params,successCb,errorCb);
    	};
    }

}());
