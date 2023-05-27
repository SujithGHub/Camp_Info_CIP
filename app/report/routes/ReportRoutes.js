(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.report')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('report', {
                url: "/report",
                templateUrl: "app/report/views/report.html",
                controller: "ReportController",
                controllerAs: "reportCtrl"
            });
    }

})();