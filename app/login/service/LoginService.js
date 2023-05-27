(function() {
	'use strict';

	/**
	 * @ngdoc Service
	 * @name LoginService
	 * @module cip
	 * @require $log,
	 * @description
	 *
	 * LoginService
	 *
	 * @author
	 * @copyright
	 */

	angular
	.module('cip.login')
	.service('LoginService', LoginService);

	LoginService.$inject = [
	                           '$log',
	                           'LoginFactory'
	                           ];

	function LoginService($log, loginFactory) {

		this.getLoginImages = function(params,successCb,errorCb){
			loginFactory.getLoginImages(params,successCb,errorCb);
		};
	}

}());
