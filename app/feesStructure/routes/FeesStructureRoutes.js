(function () {
    'use strict';

    /**
     * @author Mariselvam
     */
    angular
        .module('cip.feesStructure')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('feesStructure', {
                url: "/feesStructure",
                templateUrl: "app/feesStructure/views/feesStructureList.html",
                controller: "FeesStructureController",
                controllerAs: "feesCtrl"
            })
            .state('studentPaymentMode', {
                url: "/studentPaymentMode",
                templateUrl: "app/feesStructure/views/studentPaymentMode.html",
                controller: "FeesStructureController",
                controllerAs: "feesCtrl"
            });
    }

})();