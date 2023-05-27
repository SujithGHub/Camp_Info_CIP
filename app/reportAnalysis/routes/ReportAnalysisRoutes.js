(function() {
    'use strict';

    /**
     * @author Deepa
     */
    angular
        .module('cip.reportAnalysis')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
          .state('reportAnalysis', {
                url: "/reportAnalysis",
                templateUrl: "app/reportAnalysis/views/ReportAnalysis.html",
                controller: "ReportAnalysisController",
                controllerAs: "reportAnalysisCtrl"
            });
    }

})();