(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.payment')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('viewpayment', {
                url: "/viewpayment",
                templateUrl: "app/payment/views/paymentList.html",
                controller: "PaymentController",
                controllerAs: "paymentCtrl"
            }).state('payment', {
                url: "/payment",
                templateUrl: "app/payment/views/feesStructure.html",
                controller: "PaymentController",
                controllerAs: "paymentCtrl"
            }).state('payFees', {
                url: "/payFees",
                templateUrl: "app/payment/views/payment.html",
                controller: "PaymentController",
                controllerAs: "paymentCtrl"
            });
    }

})();