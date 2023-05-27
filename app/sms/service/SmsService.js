(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name SmsService
     * @module cip.sms
     * @require $log,
     * @description
     *
     * SectionService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.sms')
        .service('SmsService', SmsService);

    SmsService.$inject = [
        '$log',
        'SmsFactory'
     ];

    function SmsService($log,smsFactory) {
    	
    	this.sendGroupSms = function(params,successCb,errorCb) {
    		smsFactory.sendGroupSms(params,successCb,errorCb);
    	};
    	
    }

}());
