(function() {
    'use strict';

    /**
     * @author Deepa
     */
    angular
        .module('cip.viewAttendance')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
          .state('viewattendance', {
                url: "/viewattendance",
                templateUrl: "app/viewAttendance/views/viewAttendance.html",
                controller: "ViewAttendanceController",
                controllerAs: "viewAttendanceCtrl"
            });
    }

})();