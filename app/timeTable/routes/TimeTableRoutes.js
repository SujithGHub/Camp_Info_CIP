(function() {
    'use strict';

    /**
     * @author Deepa
     */
    angular
        .module('cip.timeTable')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('timeTable', {
                url: "/timeTable",
                templateUrl: "app/timeTable/views/create.html",
                controller: "TimeTableController",
                controllerAs: "timeTableCtrl"
            });
    }

})();