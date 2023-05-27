(function() {
    'use strict';

    /**
     * @author Jenis Ephrim
     */
    angular
        .module('cip.studentsElectiveSubject')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('studentselectivesubject', {
                url: "/studentsElectiveSubject",
                templateUrl: "app/studentsElectiveSubject/views/StudentsElectiveSubject.html",
                controller: "StudentsElectiveSubjectController",
                controllerAs: "StudentsElectSubCtrl"
            });
    }

})();