(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.notification')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('viewnotification', {
                url: "/viewnotification",
                templateUrl: "app/notification/views/notificationList.html",
                controller: "NotificationController",
                controllerAs: "notificationCtrl"
            }).state('notification', {
                url: "/notification",
                templateUrl: "/app/notification/views/create.html",
                controller: "NotificationController",
                controllerAs: "notificationCtrl"
            });
    }

})();