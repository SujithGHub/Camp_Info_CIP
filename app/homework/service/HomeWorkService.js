(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name HomeWorkService
     * @module cip.homeWork
     * @require $log,
     * @description
     *
     * HomeWorkService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.homeWork')
        .service('HomeWorkService', HomeWorkService);

    HomeWorkService.$inject = [
        '$log',
        'HomeWorkFactory',
        'HomeWorkTable',
        'CommonService'
     ];

    function HomeWorkService($log, homeWorkFactory, homeWorkTable, commonService) {
    	
    	this.saveHomeWork = function(params, successCb, errorCb){
    		homeWorkFactory.$save(params, successCb, errorCb);
    	};
    	this.updateHomeWork = function(params, successCb, errorCb){
    		homeWorkFactory.$update(params, successCb, errorCb);
    	};
    	this.deleteHomeWork = function(params, successCb, errorCb){
    		homeWorkFactory.$delete(params, successCb, errorCb);
    	};
    	this.removeImage = function(params,successCb,errorCb){
    		homeWorkFactory.removeImage(params,successCb,errorCb);
		};
		this.getHomeWorkImageById = function(params,successCb,errorCb){
			homeWorkFactory.getHomeworkPicture(params,successCb,errorCb);
		};
		this.getSubmittedHomeworkByHomeworkId = function(params,successCb,errorCb) {
			homeWorkFactory.getSubmittedHomeworkByHomeworkId(params,successCb,errorCb);
		};
		
    	this.initTable=function(tableElm, role, status,classYear,section) {
    		var additionalRequestParams = 'type='+(status || '')+'&role='+(role || '')+'&searchInfo='+(classYear || '')+'&section='+(section || '');
    		commonService.setTableConfig(tableElm, homeWorkTable, '/homework', true, additionalRequestParams);
		};
    }

}());
