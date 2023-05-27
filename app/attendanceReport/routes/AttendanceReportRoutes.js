(function() {
    'use strict';

    /**
     * @author Deepa
     */
    angular
        .module('cip.attendanceReport')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

    	$stateProvider
    	.state('attendancereport', {
    		url: "/attendancereport",
    		templateUrl: "app/attendanceReport/views/attendanceReport.html",
    		controller: "AttendanceReportController",
    		controllerAs: "attendanceReportCtrl"
    	});
    }

})();