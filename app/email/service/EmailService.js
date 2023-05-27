(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name HolidayService
     * @module cip.holiday
     * @require $log,
     * @description
     *
     * HolidayService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.email')
        .service('EmailService', EmailService);

    EmailService.$inject = [
        '$log',
        'EmailFactory'
     ];

    function EmailService($log, emailFactory) {
    	
    	this.sendGroupEmail = function(params, successCb, errorCb){
    		emailFactory.sendGroupEmail(params, successCb, errorCb);
    	};
    }

}());
