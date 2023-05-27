(function() {
    'use strict';

    /**
     * @author Krishna
     */
    angular
        .module('cip.attendanceCorrection')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('attendanceCorrection', {
                url: "/attendanceCorrection",
                templateUrl: "app/attendanceCorrection/views/attendanceCorrectionList.html",
                controller: "AttendanceCorrectionController",
                controllerAs: "attendanceCorrectionCtrl"
            });
    }

})();