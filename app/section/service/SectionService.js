(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name SectionService
     * @module cip.section
     * @require $log,
     * @description
     *
     * SectionService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.section')
        .service('SectionService', SectionService);

    SectionService.$inject = [
        '$log',
        'SectionFactory',
        'SectionTable',
        'CommonService'
     ];

    function SectionService($log, sectionFactory, sectionTable, commonService) {
    	
    	this.saveSection = function(params,successCb,errorCb) {
    		sectionFactory.$save(params,successCb,errorCb);
    	};
    	this.updateSection = function(params,successCb,errorCb) {
    		sectionFactory.$update(params,successCb,errorCb);
    	};
    	this.getSectionByStandardId = function(params,successCb,errorCb) {
    		sectionFactory.getsectionByClassId(params,successCb,errorCb);
    	};
    	this.getSectionByStandardType = function(params,successCb,errorCb) {
    		sectionFactory.getSectionByStandardType(params,successCb,errorCb);
    	};
    	this.getSectionByDeptId = function(params,successCb,errorCb) {
    		sectionFactory.getSectionByDeptId(params,successCb,errorCb);
    	};
    	this.getsectionByClassYearIdIsRestrict = function(params,successCb,errorCb) {
    		sectionFactory.getsectionByClassYearIdIsRestrict(params,successCb,errorCb);
    	};
    	this.getCorrespondingAndIsRestrictSections = function(params,successCb,errorCb) {
    		sectionFactory.getCorrespondingAndIsRestrictSections(params,successCb,errorCb);
    	};
    	this.getsectionByClassId = function(params,successCb,errorCb) {
    		sectionFactory.getsectionByClassId(params,successCb,errorCb);
    	};
    	this.getSectionByDepartmentAndClassAndRole = function(params,successCb,errorCb) {
    		sectionFactory.getSectionByDepartmentAndClassAndRole(params,successCb,errorCb);
    	};
    	this.initTable=function(tableElm) {
    		commonService.setTableConfig(tableElm, sectionTable, '/section', true);
		};
    	
    }

}());
