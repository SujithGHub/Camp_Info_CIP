(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.examination')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('exam', {
                url: "/exam",
                templateUrl: "app/examination/views/examinationList.html",
                controller: "ExaminationController",
                controllerAs: "examinationCtrl"
            })
            .state('exampaper', {
                url: "/exampaper",
                templateUrl: "app/examination/views/exampaperList.html",
                controller: "ExampaperController",
                controllerAs: "exampaperCtrl"
            });
    }

})();