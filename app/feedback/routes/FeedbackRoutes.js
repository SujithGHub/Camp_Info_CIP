(function() {
    'use strict';

    /**
     * @author Deepa
     */
    angular
        .module('cip.feedback')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('feedback', {
                url: "/feedback",
                templateUrl: "app/feedback/views/viewFeedback.html",
                controller: "FeedbackController",
                controllerAs: "feedbackCtrl"
            });
    }

})();