(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.academic')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('academic', {
                url: "/academic",
                templateUrl: "app/academic/views/academicList.html",
                controller: "AcademicController",
                controllerAs: "academicCtrl"
            });
    }

})();