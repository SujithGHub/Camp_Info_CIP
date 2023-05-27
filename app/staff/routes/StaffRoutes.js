(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.staff')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('staff', {
                url: "/staff",
                templateUrl: "app/staff/views/staffList.html",
                controller: "StaffController",
                controllerAs: "staffCtrl"
            });
    }

})();