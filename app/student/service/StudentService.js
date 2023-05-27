(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name StudentService
     * @module cip.student
     * @require $log,
     * @description
     *
     * StudentService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.student')
        .service('StudentService', StudentService);

    StudentService.$inject = [
        '$log',
        'StudentFactory',
        'StudentTable',
        'CommonService'
     ];

    function StudentService($log, studentFactory, studentTable, commonService) {
    	
    	this.getStudentByRollNumber = function(params,successCb,errorCb){
    		studentFactory.get(params,successCb,errorCb);
    	};
    	this.getStudentListByAcademic = function(params,successCb,errorCb){
    		studentFactory.getStudentListByAcademic(params,successCb,errorCb);
    	};
    	this.saveStudent = function(params,successCb,errorCb){
    		studentFactory.$save(params,successCb,errorCb);
    	};
    	this.updateStudent = function(params,successCb,errorCb){
    		studentFactory.$update(params,successCb,errorCb);
    	};
    	this.updateStudentAcademic = function(params,successCb,errorCb){
    		studentFactory.updateStudentAcademic(params,successCb,errorCb);
    	};
    	this.updatePassoutStudent = function(params,successCb,errorCb){
    		studentFactory.updatePassoutStudent(params,successCb,errorCb);
    	};
    	this.initTable=function(tableElm, searchInfo) {
    		commonService.setTableConfig(tableElm, studentTable, '/student', true, 'searchInfo='+searchInfo);
		};
    	
    }

}());
