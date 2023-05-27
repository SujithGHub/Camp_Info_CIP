(function() {
	'use strict';

	/**
	 * @author Ashokrajan
	 */
	angular
	.module('cip.institute')
	.config(config);

	config.$inject = [
	                  '$stateProvider',
	                  '$urlRouterProvider'
	                  ];

	function config($stateProvider, $urlRouterProvider) {

		$stateProvider
		.state('institute', {
			url: "/institute",
			templateUrl: "app/institute/views/instituteList.html",
			controller: "InstituteController",
			controllerAs: "instituteCtrl"
		});
	}

})();