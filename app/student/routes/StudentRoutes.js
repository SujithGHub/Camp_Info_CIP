(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.student')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('student', {
                url: "/student",
                templateUrl: "app/student/views/studentList.html",
                controller: "StudentController",
                controllerAs: "studentCtrl"
            });
    }

})();