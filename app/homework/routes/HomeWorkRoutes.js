(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.homeWork')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('homework', {
                url: "/homework",
                templateUrl: "app/homework/views/homeWorkList.html",
                controller: "HomeWorkController",
                controllerAs: "homeWorkCtrl"
            });
    }

})();