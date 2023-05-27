(function() {
	'use strict';

	/**
	 * @author Deepa
	 */
	angular
	.module('cip.smtp')
	.config(config);

	config.$inject = [
	                  '$stateProvider',
	                  '$urlRouterProvider'
	                  ];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
		.state('smtpConfig', {
			url: "/smtpConfig",
			templateUrl: "app/smtp/views/smtpList.html",
			controller: "SmtpController",
			controllerAs: "smtpCtrl"
		});
	}

})();