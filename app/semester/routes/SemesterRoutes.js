(function() {
    'use strict';

    /**
     * @author Gunasekaran jayaraj
     */
    angular
        .module('cip.semester')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('semester', {
                url: "/semester",
                templateUrl: "app/semester/views/semesterList.html",
                controller: "SemesterController",
                controllerAs: "semesterCtrl"
            });
    }

})();