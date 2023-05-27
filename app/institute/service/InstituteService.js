(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name InstituteService
     * @module cip.institute
     * @require $log,
     * @description
     *
     * InstituteService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.institute')
        .service('InstituteService', InstituteService);

    InstituteService.$inject = [
        '$log',
        'InstituteFactory',
        'InstituteTable',
        'CommonService'
     ];

    function InstituteService($log, InstituteFactory, instituteTable, commonService) {
    	
    	this.saveInstitute = function(params, successCb, errorCb){
    		InstituteFactory.$save(params, successCb, errorCb);
    	};
    	this.updateInstitute = function(params, successCb, errorCb){
    		InstituteFactory.$update(params, successCb, errorCb);
    	};
    	this.deleteInstitute = function(params, successCb, errorCb){
    		InstituteFactory.$delete(params, successCb, errorCb);
    	};
    	this.getInstituteListByInstituteName = function(params, successCb, errorCb) {
    		InstituteFactory.getInstituteListByInstituteName(params, successCb, errorCb)
    	}
    	this.getInstituteList = function(params, successCb, errorCb) {
    		InstituteFactory.getInstituteList(params, successCb, errorCb)
    	}
    	this.initTable=function(tableElm) {
    		commonService.setTableConfig(tableElm, instituteTable, '/institute');
    	}
    }

}());
