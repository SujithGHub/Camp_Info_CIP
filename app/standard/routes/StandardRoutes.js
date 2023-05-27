(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.standard')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('standard', {
                url: "/standard",
                templateUrl: "app/standard/views/standardList.html",
                controller: "StandardController",
                controllerAs: "standardCtrl"
            })
            .state('year', {
                url: "/year",
                templateUrl: "app/standard/views/standardList.html",
                controller: "StandardController",
                controllerAs: "standardCtrl"
            });
    }

})();