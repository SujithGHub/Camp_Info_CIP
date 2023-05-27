(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.sms')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('groupsms', {
                url: "/groupsms",
                templateUrl: "app/sms/views/groupSms.html",
                controller:"SmsController",
                controllerAs:"smsCtrl"
            })
            .state('bulksms', {
                url: "/bulksms",
                templateUrl: "app/sms/views/bulkSms.html",
                controller:"SmsController",
                controllerAs:"smsCtrl"
            }).state('broadcastsms', {
                url: "/broadcastsms",
                templateUrl: "app/sms/views/broadcastSms.html",
                controller:"SmsController",
                controllerAs:"smsCtrl"
            });
    }

})();