(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name PaymentGatewayService
     * @module cip.PaymentGateway
     * @require $log,
     * @description
     *
     * PaymentGatewayService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.paymentGateway')
        .service('PaymentGatewayService', PaymentGatewayService);

    PaymentGatewayService.$inject = [
        '$log',
        'PaymentGatewayFactory',
        'PaymentGatewayTable',
        'CommonService'
     ];

    function PaymentGatewayService($log,paymentGatewayFactory, paymentGatewayTable, commonService) {
    	
    	this.savePaymentGateway = function(params, successCb, errorCb) {
    		paymentGatewayFactory.$save(params, successCb, errorCb);
    	}
    	
    	this.updatePaymentGateway = function(params, successCb, errorCb) {
    		paymentGatewayFactory.$update(params, successCb, errorCb);
    	}
    	
     	this.deletePaymentGateway = function(params, successCb, errorCb) {
     		paymentGatewayFactory.$delete(params, successCb, errorCb);
    	}
     	
    	this.initTable = function(tableElm) {
    		commonService.setTableConfig(tableElm, paymentGatewayTable, '/paymentgateway');
    	}
    }

}());
