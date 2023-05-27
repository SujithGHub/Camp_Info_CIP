(function() {
	'use strict';

	/**
	 * @ngdoc Service
	 * @name SubjectService
	 * @module cip.subject
	 * @require $log,
	 * @description
	 * 
	 * SubjectService
	 * 
	 * @author
	 * @copyright
	 */

	angular.module('cip.subject').service('SubjectService', SubjectService);

	SubjectService.$inject = [ '$log', 'SubjectFactory', 'SubjectTable',
			'CommonService' ];

	function SubjectService($log, subjectFactory, subjectTable, commonService) {

		this.saveSubject = function(params, successCb, errorCb) {
			subjectFactory.$save(params, successCb, errorCb);
		};
		this.updateSubject = function(params, successCb, errorCb) {
			subjectFactory.$update(params, successCb, errorCb);
		};
		this.getSubjectByClassId = function(params, successCb, errorCb) {
			subjectFactory.getSubjectByClassId(params, successCb, errorCb);
		};
		this.deleteSubject = function(params, successCb, errorCb) {
			subjectFactory.$delete(params, successCb, errorCb);
		};
		this.getSubjectByExamId = function(params, successCb, errorCb) {
			subjectFactory.getSubjectByExamId(params, successCb, errorCb);
		};
		this.getSubjectBySemesterId = function(params, successCb, errorCb) {
			subjectFactory.getSubjectBySemesterId(params, successCb, errorCb);
		};
		
		this.getSubjectByClassIdAndSemesterId = function(params, successCb, errorCb) {
			subjectFactory.getSubjectByClassIdAndSemesterId(params, successCb, errorCb);
		};	
				
		this.getStudentSubjectByClassYearId = function(params, successCb, errorCb) {
			subjectFactory.getStudentSubjectByClassYearId(params, successCb, errorCb);
		};
		this.saveElectiveSubject = function(params, successCb, errorCb) {
			subjectFactory.saveElectiveSubject(params, successCb, errorCb);
		};
		this.updateElectiveSubject = function(params, successCb, errorCb) {
			subjectFactory.updateElectiveSubject(params, successCb, errorCb);
		};
		this.deleteElectivesubject = function(params, successCb, errorCb) {
			subjectFactory.deleteElectivesubject(params, successCb, errorCb);
		};
		this.getElectiveSubjectBySubjectId = function(params, successCb, errorCb) {
			subjectFactory.getElectiveSubjectBySubjectId(params, successCb, errorCb);
		};
        this.getSubjectBySemesterAndSectionAndStaff = function(params, successCb, errorCb) {
            subjectFactory.getSubjectBySemesterAndSectionAndStaff(params, successCb, errorCb);
        };
        this.getsubjectByClassYearAndSectionAndStaff = function(params, successCb, errorCb) {
            subjectFactory.getsubjectByClassYearAndSectionAndStaff(params, successCb, errorCb);
        };
		this.getElectiveSubjectBySubjectByStaff = function(params,successCb,errorCb){
			subjectFactory.getElectiveSubjectBySubjectByStaff(params, successCb, errorCb);
		};
		this.initTable = function(tableElm) {
			commonService.setTableConfig(tableElm, subjectTable, '/subject', true);
		}
	}

}());
