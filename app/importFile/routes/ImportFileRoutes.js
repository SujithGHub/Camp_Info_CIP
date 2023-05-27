(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.importfile')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('import', {
                url: "/import",
                templateUrl: "app/importFile/views/importFile.html",
                controller:"ImportFileController",
                controllerAs:"importFileCtrl"
            });
    }

})();