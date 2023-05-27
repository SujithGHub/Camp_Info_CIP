(function() {
    'use strict';

    /**
     * @author Deepa
     */
    angular
        .module('cip.attendanceAnalysis')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

    	$stateProvider
    	.state('attendanceanalysis', {
    		url: "/attendanceanalysis",
    		templateUrl: "app/attendanceAnalysis/views/attendanceAnalysis.html",
    		controller: "AttendanceAnalysisController",
    		controllerAs: "attendanceAnalysisCtrl"
    	});
    }

})();