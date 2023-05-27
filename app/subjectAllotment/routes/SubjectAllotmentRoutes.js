(function() {
    'use strict';

    /**
     * @author Deepa
     */
    angular
        .module('cip.subjectAllotment')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('subjectAllotment', {
                url: "/subjectAllotment",
                templateUrl: "app/subjectAllotment/views/create.html",
                controller: "SubjectAllotmentController",
                controllerAs: "subjectAllotmentCtrl"
            });
    }

})();