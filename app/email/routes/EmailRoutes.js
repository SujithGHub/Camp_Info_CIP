(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.email')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('groupemail', {
                url: "/groupemail",
                templateUrl: "app/email/views/groupEmail.html",
                controller:"EmailController",
                controllerAs:"emailCtrl"
            })
            .state('bulkemail', {
                url: "/bulkemail",
                templateUrl: "app/email/views/bulkEmail.html",
                controller:"EmailController",
                controllerAs:"emailCtrl"
            }).state('broadcastemail', {
                url: "/broadcastemail",
                templateUrl: "app/email/views/broadcastEmail.html",
                controller:"EmailController",
                controllerAs:"emailCtrl"
            });
    }

})();