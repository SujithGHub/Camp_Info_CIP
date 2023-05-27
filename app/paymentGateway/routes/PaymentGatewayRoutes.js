(function() {
	'use strict';

	/**
	 * @author Gunasekaran
	 */
	angular
	.module('cip.paymentGateway')
	.config(config);

	config.$inject = [
	                  '$stateProvider',
	                  '$urlRouterProvider'
	                  ];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
		.state('paymentGateway', {
			url: "/paymentGateway",
			templateUrl: "app/paymentGateway/views/paymentGatewayList.html",
			controller: "PaymentGatewayController",
			controllerAs: "PaymentGatewayCtrl"
		});
	}

})();