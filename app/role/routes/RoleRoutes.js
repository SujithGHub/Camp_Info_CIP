(function() {
    'use strict';

    /**
     * @author Deepa
     */
    angular
        .module('cip.role')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('role', {
                url: "/role",
                templateUrl: "app/role/views/roleList.html",
                controller: "RoleController",
                controllerAs: "roleCtrl"
            });
    }

})();