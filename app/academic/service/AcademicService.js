(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name AcademicService
     * @module cip.academic
     * AcademicService
     * @author
     * @copyright
     */
  
    angular
        .module('cip.academic')
        .service('AcademicService', AcademicService);

    AcademicService.$inject = [
        'AcademicFactory',
        'AcademicTable',
        'CommonService'
     ];

    function AcademicService(academicFactory, academicTable, commonService) {
    	
    	this.saveAcademic = function(params, successCb, errorCb) {
    		academicFactory.save(params, successCb, errorCb);
    	};
    	this.updateAcademic = function(params, successCb, errorCb) {
    		academicFactory.$update(params, successCb, errorCb);
    	};
    	this.getAcademic = function(params, successCb, errorCb) {
    		academicFactory.getAcademic(params, successCb, errorCb);
    	};
    	this.getCurrentAcademicYear = function(params, successCb, errorCb) {
    		academicFactory.getCurrentAcademicYear(params, successCb, errorCb);
    	};
    	this.initTable=function(tableElm) {
    		commonService.setTableConfig(tableElm, academicTable, '/academic');
    	}
    }

}());
