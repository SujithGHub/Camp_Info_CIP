(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.holiday')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('holiday', {
                url: "/holiday",
                templateUrl: "app/holiday/views/holidayList.html",
                controller: "HolidayController",
                controllerAs: "holidayCtrl"
            }).state('mycalendar', {
                url: "/mycalendar",
                templateUrl: "app/holiday/views/myCalendar.html",
                controller: "HolidayController",
                controllerAs: "holidayCtrl"
            });
    }

})();