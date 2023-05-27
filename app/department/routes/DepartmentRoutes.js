(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.department')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('department', {
                url: "/department",
                templateUrl: "app/department/views/departmentList.html",
                controller: "DepartmentController",
                controllerAs: "departmentCtrl"
            });
    }

})();