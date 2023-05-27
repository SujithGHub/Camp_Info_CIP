(function() {
	'use strict';

	/**
	 * @author Gunasekaran
	 */
	angular
	.module('cip.smsGateway')
	.config(config);

	config.$inject = [
	                  '$stateProvider',
	                  '$urlRouterProvider'
	                  ];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
		.state('smsGateway', {
			url: "/smsGateway",
			templateUrl: "app/smsGateway/views/smsGatewayList.html",
			controller: "SmsGatewayController",
			controllerAs: "smsGatewayCtrl"
		});
	}

})();