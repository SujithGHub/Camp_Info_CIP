(function() {
    'use strict';

    /**
     * @author Ashokrajan
     **/
    angular
        .module('cip.login')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "app/login/views/login.html",
                controller: "LoginController",
                controllerAs: "loginCtrl"
            });
    }

})();