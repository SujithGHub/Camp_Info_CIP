(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name ClassifiedService
     * @module cip.classifieds
     * @require $log,
     * @description
     *
     * ClassifiedService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.classifieds')
        .service('ClassifiedService', ClassifiedService);

    ClassifiedService.$inject = [
        '$log',
        'ClassifiedFactory',
        'ClassifiedTable',
        'CommonService'
     ];

    function ClassifiedService($log, classifiedFactory, classifiedTable, commonService) {
    	
    	this.deleteClassified = function(params,successCb,errorCb){
    		classifiedFactory.$delete(params,successCb,errorCb);
    	};
    	this.removeImage = function(params,successCb,errorCb){
    		classifiedFactory.removeImage(params,successCb,errorCb);
    	};
    	this.getViewClassified = function(params,successCb,errorCb){
    		classifiedFactory.get(params,successCb,errorCb);
    	};
    	this.getDashboardClassified = function(params,successCb,errorCb){
    		classifiedFactory.getDashboardClassified(params,successCb,errorCb);
    	};
    	this.initTable=function(tableElm, url) {
    		commonService.setTableConfig(tableElm, classifiedTable, url);
		};
    }

}());
