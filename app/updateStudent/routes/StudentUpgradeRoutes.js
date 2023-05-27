(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.studentUpgrade')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('studentsupgrade', {
                url: "/studentsupgrade",
                templateUrl: "app/updateStudent/views/studentUpgrade.html",
                controller: "StudentUpgradeController",
                controllerAs: "studentUpgradeCtrl"
            });
    }

})();