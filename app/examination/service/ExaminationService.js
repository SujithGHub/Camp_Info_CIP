(function() {
	'use strict';

	/**
	 * @ngdoc Service
	 * @name ExaminationService
	 * @module cip.examination
	 * ExaminationService
	 * @author
	 * @copyright
	 */

	angular
	.module('cip.examination')
	.service('ExaminationService', ExaminationService);

	ExaminationService.$inject = [
	                           'CommonService',
	                           'ExaminationTable',
	                           'ExaminationFactory'
	                           ];

	function ExaminationService(commonService, examinationTable, examinationFactory) {

		this.saveExamination = function(params,successCb,errorCb) {
    		examinationFactory.$save(params,successCb,errorCb);
    	};
    	this.saveExampaper = function(params,successCb,errorCb) {
    		examinationFactory.saveExampaper(params,successCb,errorCb);
    	};
    	this.updateExampaper = function(params,successCb,errorCb) {
    		examinationFactory.updateExampaper(params,successCb,errorCb);
    	};
    	this.updateExamination = function(params,successCb,errorCb) {
    		examinationFactory.$update(params,successCb,errorCb);
    	};
		this.deleteExamination = function(params,successCb,errorCb) {
    		examinationFactory.$delete(params,successCb,errorCb);
    	};
    	this.deleteExampaper = function(params,successCb,errorCb) {
    		examinationFactory.deleteExampaper(params,successCb,errorCb);
    	};
    	this.getExaminationByClassId = function(params,successCb,errorCb) {
    		examinationFactory.getExamByClassId(params,successCb,errorCb);
    	};
    	this.getExamByDepartmentAndClassId = function(params,successCb,errorCb) {
    		examinationFactory.getExamByDepartmentAndClassId(params,successCb,errorCb);
    	};
    	this.getExamByClassAndAcademicId = function(params,successCb,errorCb) {
    		examinationFactory.getExamByClassAndAcademicId(params,successCb,errorCb);
    	};
    	this.getExamByClassAcademicIdAndSemester = function(params,successCb,errorCb) {
    		examinationFactory.getExamByClassAcademicIdAndSemester(params,successCb,errorCb);
    	};
    	this.getExamByStudent = function(params,successCb,errorCb) {
    		examinationFactory.getExamByStudent(params,successCb,errorCb);
    	};
    	this.getExamList = function(params,successCb,errorCb) {
    		examinationFactory.getExamList(params,successCb,errorCb);
    	};
    	this.getExamPaperById = function(params,successCb,errorCb) {
    		examinationFactory.getExamPaperById(params,successCb,errorCb);
    	};
    	this.getExamPaperByExamAndSubjectId = function(params,successCb,errorCb) {
    		examinationFactory.getExamPaperByExamAndSubjectId(params,successCb,errorCb);
    	};
    	this.getExamByClassSectionAndAcademicId = function(params,successCb,errorCb) {
    		examinationFactory.getExamByClassSectionAndAcademicId(params,successCb,errorCb);
    	};
    	this.getExamByClassSectionAcademicIdAndSemester = function(params,successCb,errorCb) {
    		examinationFactory.getExamByClassSectionAcademicIdAndSemester(params,successCb,errorCb);
    	};
    	
		this.initTable=function(tableElm) {
			commonService.setTableConfig(tableElm, examinationTable, '/examination/examinations', true);
		};
	}

}());
