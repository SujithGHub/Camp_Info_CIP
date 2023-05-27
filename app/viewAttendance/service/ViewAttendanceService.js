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
     * @author
     * @copyright
     */
  
    angular
        .module('cip.viewAttendance')
        .service('ViewAttendanceService', ViewAttendanceService);

    ViewAttendanceService.$inject = [
        '$log',
        'ViewAttendanceFactory',
     ];

    function ViewAttendanceService($log,viewAttendanceFactory) {
    	this.getAttendanceReport = function(params,successCb,errorCb){
    		viewAttendanceFactory.getAttendanceReport(params,successCb,errorCb);
    	};

    }

}());
