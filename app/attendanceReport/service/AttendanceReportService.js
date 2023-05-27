(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name AttendanceReportService
     * @module cip.attendanceReport
     * @require $log,
     * @description
     *
     * AttendanceReportService
     *
     * @author Deepa
     * @copyright
     */
  
    angular
        .module('cip.attendanceReport')
        .service('AttendanceReportService', AttendanceReportService);

    AttendanceReportService.$inject = [
        '$log',
        'AttendanceReportFactory',
     ];

    function AttendanceReportService($log,attendanceReportFactory) {
    	this.getAttendanceReport = function(params,successCb,errorCb){
    		attendanceReportFactory.getAttendanceReport(params,successCb,errorCb);
    	};
    	
    	this.getAttendancePercentage = function(params,successCb,errorCb){
    		attendanceReportFactory.getAttendancePercentage(params,successCb,errorCb);
    	};
    	
    	this.getAttendanceBySection = function(params,successCb,errorCb){
    		attendanceReportFactory.getAttendanceBySection(params,successCb,errorCb);
    	};
    	
    	this.getMonthwiseAttendance = function(successCb,errorCb){
    		attendanceReportFactory.getMonthwiseAttendance(successCb,errorCb);
    	};
    }

}());
