(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.classifieds')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('classifieds', {
                url: "/classifieds",
                templateUrl: "app/classifieds/views/classifiedList.html",
                controller: "ClassifiedController",
                controllerAs: "classifiedCtrl"
            }).state('viewclassifieds', {
                url: "/viewclassifieds",
                templateUrl: "app/classifieds/views/viewClassified.html",
                controller: "ClassifiedController",
                controllerAs: "classifiedCtrl"
            });
    }

})();