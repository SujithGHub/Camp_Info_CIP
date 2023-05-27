(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name DepartmentService
     * @module cip.department
     * @require $log,
     * @description
     *
     * DepartmentService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.department')
        .service('DepartmentService', DepartmentService);

    DepartmentService.$inject = [
        '$log',
        'DepartmentFactory',
        'DepartmentTable',
        'CommonService'
     ];

    function DepartmentService($log, departmentFactory, departmentTable, commonService) {
    	
    	this.saveDepartment = function(params, successCb, errorCb) {
    		departmentFactory.save(params, successCb, errorCb);
    	};
    	this.updateDepartment = function(params, successCb, errorCb) {
    		departmentFactory.$update(params, successCb, errorCb);
    	};
    	this.getActiveDepartment = function(successCb, errorCb) {
    		departmentFactory.getActiveDepartment(successCb, errorCb);
    	};
    	this.getDeptByClassName = function(successCb, errorCb) {
    		departmentFactory.getDeptByClassName(successCb,errorCb);
    	};
    	this.getActiveDepartmentIsRestrict = function(successCb, errorCb) {
    		departmentFactory.getActiveDepartmentIsRestrict(successCb, errorCb);
    	};
    	this.getCorrespondingAndIsRestrictDepartments = function(successCb, errorCb) {
    		departmentFactory.getCorrespondingAndIsRestrictDepartments(successCb, errorCb);
    	};
        this.getDepartmentByRole = function(successCb, errorCb) {
            departmentFactory.getDepartmentByRole(successCb, errorCb);
        };
    	this.initTable=function(tableElm) {
    		commonService.setTableConfig(tableElm, departmentTable, '/department');
  	    }
    }

}());
