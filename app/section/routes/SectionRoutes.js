(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.section')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('section', {
                url: "/section",
                templateUrl: "app/section/views/sectionList.html",
                controller: "SectionController",
                controllerAs: "sectionCtrl"
            });
    }

})();