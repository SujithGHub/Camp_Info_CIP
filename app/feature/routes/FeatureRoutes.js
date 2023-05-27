(function() {
    'use strict';

    /**
     * @author Deepa
     */
    angular
        .module('cip.feature')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('feature', {
                url: "/feature",
                templateUrl: "app/feature/views/instituteList.html",
                controller: "FeatureController",
                controllerAs: "featureCtrl"
            });
    }

})();