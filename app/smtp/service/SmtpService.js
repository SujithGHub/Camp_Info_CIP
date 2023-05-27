(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name SmtpService
     * @module cip.smtp
     * @require $log,
     * @description
     *
     * SmtpService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.smtp')
        .service('SmtpService', SmtpService);

    SmtpService.$inject = [
        '$log',
        'SmtpFactory',
        'SmtpTable',
        'CommonService'
     ];

    function SmtpService($log,SmtpFactory, smtpTable, commonService) {
    	
    	this.saveSmtp = function(params, successCb, errorCb) {
    		SmtpFactory.$save(params, successCb, errorCb);
    	}
    	
    	this.updateSmtp = function(params, successCb, errorCb) {
    		SmtpFactory.$update(params, successCb, errorCb);
    	}
    	
     	this.deleteSmtp = function(params, successCb, errorCb) {
    		SmtpFactory.$delete(params, successCb, errorCb);
    	}
     	
    	this.initTable = function(tableElm) {
    		commonService.setTableConfig(tableElm, smtpTable, '/smtp/config');
    	}
    }

}());
