(function() {
    'use strict';

    /**
     * @author Deepa
     */
    angular
        .module('cip.attendance')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('attendance', {
                url: "/attendance",
                templateUrl: "app/attendance/views/attendance.html",
                controller: "AttendanceController",
                controllerAs: "attendanceCtrl"
            });
    }

})();