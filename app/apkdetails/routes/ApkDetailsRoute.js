(function() {
	'use strict';

	/**
	 * @author Krishna
	 */
	angular
	.module('cip.apkDetails')
	.config(config);

	config.$inject = [
	                  '$stateProvider',
	                  '$urlRouterProvider'
	                  ];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
		.state('apkdetails', {
			url: "/apkDetailsConfig",
			templateUrl: "app/apkdetails/views/apkdetails.html",
			controller: "ApkDetailsController",
			controllerAs: "apkDetailsCtrl"
		});
	}

})();