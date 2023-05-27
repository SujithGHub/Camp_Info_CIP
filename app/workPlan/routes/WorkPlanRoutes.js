(function() {
    'use strict';

    /**
     * 
     */
    angular
        .module('cip.workPlan')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('workPlan', {
                url: "/workPlan",
                templateUrl: "app/workPlan/views/workPlanList.html",
                controller: "WorkPlanController",
                controllerAs: "workPlanCtrl"
            }).state('dailyDetail', {
            url: "/dailyDetail",
            templateUrl: "app/workPlan/views/dailyPlanList.html",
            controller: "WorkPlanController",
            controllerAs: "workPlanCtrl"
        }).state('workPlanReport', {
            url: "/workPlanReport",
            templateUrl: "app/workPlan/views/workPlanReport.html",
            controller: "WorkPlanController",
            controllerAs: "workPlanCtrl"
        });
        
    }	

})();