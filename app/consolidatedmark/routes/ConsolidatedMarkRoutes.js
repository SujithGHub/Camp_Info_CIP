(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.consolidatedMark')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('consolidatedmark', {
                url: "/consolidatedmark",
                templateUrl: "app/consolidatedmark/views/consolidatedMark.html",
                controller: "ConsolidatedMarkController",
                controllerAs: "ConsolidatedMarkCtrl"
            });
    }

})();