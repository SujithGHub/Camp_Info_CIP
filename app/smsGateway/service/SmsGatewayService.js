(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name SmsGatewayService
     * @module cip.smsGateway
     * @require $log,
     * @description
     *
     * SmsGatewayService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.smsGateway')
        .service('SmsGatewayService', SmsGatewayService);

    SmsGatewayService.$inject = [
        '$log',
        'SmsGatewayFactory',
        'SmsGatewayTable',
        'CommonService'
     ];

    function SmsGatewayService($log,smsGatewayFactory, smsGatewayTable, commonService) {
    	
    	this.saveSmsGateway = function(params, successCb, errorCb) {
    		smsGatewayFactory.$save(params, successCb, errorCb);
    	}
    	
    	this.updateSmsGateway = function(params, successCb, errorCb) {
    		smsGatewayFactory.$update(params, successCb, errorCb);
    	}
    	
     	this.deleteSmsGateway = function(params, successCb, errorCb) {
     		smsGatewayFactory.$delete(params, successCb, errorCb);
    	}

    	this.getInstituteSmsStatisticsReport = function(params, successCb, errorCb) {
            smsGatewayFactory.getInstituteSmsStatisticsReport(params, successCb, errorCb);
        };
     	
    	this.initTable = function(tableElm,paramObj) {
    		commonService.setTableConfig(tableElm, smsGatewayTable, '/smsgateway');
    	}
    }

}());
