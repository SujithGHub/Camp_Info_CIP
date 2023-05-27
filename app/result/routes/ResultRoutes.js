(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.result')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('result', {
                url: "/result",
                templateUrl: "app/result/views/ResultSearch.html",
                controller: "ResultController",
                controllerAs: "resultCtrl"
            }).state('resultImport', {
                url: "/resultimport",
                templateUrl: "app/result/views/ResultImport.html",
                controller: "ResultController",
                controllerAs: "resultCtrl"
            }).state('viewResult', {
                url: "/viewResult",
                templateUrl: "app/result/views/ResultList.html",
                controller: "ResultController",
                controllerAs: "resultCtrl"
            }).state('fileUpload', {
              url: "/fileUpload",
              templateUrl: "app/result/views/resultFileUpload.html",
              controller: "ResultController",
              controllerAs: "resultCtrl"
            });
    }

})();