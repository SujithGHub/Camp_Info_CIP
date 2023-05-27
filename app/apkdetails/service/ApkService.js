(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name ApkDetailsService
     * @module cip.apkDetails
     * @require $log,
     * @description
     *
     * ApkDetailsService
     *
     * @author Krishna
     * @copyright
     */
  
    angular
        .module('cip.apkDetails')
        .service('ApkDetailsService', ApkDetailsService);

    ApkDetailsService.$inject = [
        '$log',
        'ApkDetailsFactory',
        'ApkDetailsTable',
        'CommonService'
     ];

    function ApkDetailsService($log,apkDetailsFactory, apkDetailsTable, commonService) {
    	
    	this.saveApkDetails = function(params, successCb, errorCb) {
    		apkDetailsFactory.$save(params, successCb, errorCb);
    	}
    	
    	this.updateApkDetails = function(params, successCb, errorCb) {
    		apkDetailsFactory.$update(params, successCb, errorCb);
    	}
    	
     	this.deleteApkDetails = function(params, successCb, errorCb) {
    		apkDetailsFactory.$delete(params, successCb, errorCb);
    	}
     	
    	this.initTable = function(tableElm,paramObj) {
    		commonService.setTableConfig(tableElm, apkDetailsTable, '/apk/details');
    	}
    }

}());
