(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name AttendanceAnalysisService
     * @module cip.attendanceAnalysis
     * @require $log,
     * @description
     *
     * AttendanceAnalysisService
     *
     * @author Deepa
     * @copyright
     */
  
    angular
        .module('cip.attendanceAnalysis')
        .service('AttendanceAnalysisService', AttendanceAnalysisService);

    AttendanceAnalysisService.$inject = [
        '$log',
        'AttendanceAnalysisFactory',
     ];

    function AttendanceAnalysisService($log,attendanceAnalysisFactory) {
    	this.getClassList = function(successCb,errorCb){
    		attendanceAnalysisFactory.getClassList(successCb,errorCb);
    	};
    	this.getAttendanceDetails = function(params,successCb,errorCb){
    		attendanceAnalysisFactory.getAttendanceDetails(params,successCb,errorCb);
    	};
    }

}());
