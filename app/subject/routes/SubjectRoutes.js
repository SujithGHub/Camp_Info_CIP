(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.subject')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('subject', {
                url: "/subject",
                templateUrl: "app/subject/views/subjectList.html",
                controller: "SubjectController",
                controllerAs: "subjectCtrl"
            }).state('electiveSubject', {
                url: "/electiveSubject",
                templateUrl: "app/subject/views/electiveSubjectList.html",
                controller: "ElectiveSubjectController",
                controllerAs: "electiveSubjectCtrl"
            });
    }

})();