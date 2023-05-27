(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name FeesStructureService
     * @module cip.feesStructure
     * FeesStructureService
     * @author
     * @copyright
     */
  
    angular
        .module('cip.feesStructure')
        .service('FeesStructureService', FeesStructureService);

    FeesStructureService.$inject = [
        'FeesStructureFactory',
        'FeesStructureTable',
        'StudentFeesStructureTable',
        'CommonService'
        
     ];

    function FeesStructureService(feesStructureFactory, feesStructureTable, studentFeesStructureTable, commonService) {
    	
    	this.saveFees = function(params,successCb,errorCb) {
    		feesStructureFactory.$save(params,successCb,errorCb);
    	};
    	this.updateFees = function(params,successCb,errorCb) {
    		feesStructureFactory.$update(params,successCb,errorCb);
    	};
    	this.deleteFees = function(params,successCb,errorCb) {
    		feesStructureFactory.$delete(params,successCb,errorCb);
    	};
        this.getStudentsPaymentMode = function(params,successCb,errorCb) {
            feesStructureFactory.getStudentsPaymentMode(params,successCb,errorCb);
        };
        this.saveStudentsPaymentMode = function(params,successCb,errorCb) {
            feesStructureFactory.saveStudentsPaymentMode(params,successCb,errorCb);
        };
    	this.initTable=function(tableElm) {
    		commonService.setTableConfig(tableElm, feesStructureTable, '/fees', true);
		};
    	this.initStudentFeesStructureTable=function(tableElm) {
    		commonService.setTableConfig(tableElm, studentFeesStructureTable, '/fees', true);
		}
    	
    }

}());
