(function() {
	'use strict';

	/**
	 * @ngdoc Service
	 * @name ResultService
	 * @module cip.result
	 * @require $log,
	 * @description
	 *
	 * ResultService
	 *
	 * @author
	 * @copyright
	 */

	angular
	.module('cip.result')
	.service('ResultService', ResultService);

	ResultService.$inject = [
	                           '$log',
	                           'CommonService',
	                           'ExamTable',
	                           'ResultFactory',
	                           'ResultBySubjectTable',
	                           'SharedService'
	                           ];

	function ResultService($log, commonService, examTable,resultFactory,resultBySubjectTable,SharedService) {
		
		this.getResultByExaminationId = function(params,successCb,errorCb) {
			resultFactory.get(params,successCb,errorCb);
		};

		this.getResultByExamAndRollNo = function(params,successCb,errorCb) {
			resultFactory.getResultByExamAndRollNo(params,successCb,errorCb);
		};
		
		this.getResultImageByExamination = function(params,successCb,errorCb) {
			resultFactory.getResultImageByExamination(params,successCb,errorCb);
		};

		this.getResultImageByExaminationAndRollNo = function(params,successCb,errorCb) {
			resultFactory.getResultImageByExaminationAndRollNo(params,successCb,errorCb);
		};
		
		this.removeImage = function(params,successCb,errorCb) {
			resultFactory.removeImage(params,successCb,errorCb);
		};
		
		this.getResultBySubject = function(tableElm,paramObj) {
			var tableConfig = angular.extend({}, commonService.getConfig(),resultBySubjectTable.config(commonService,paramObj,SharedService));
			var headers = resultBySubjectTable.headers,
			headersDef = resultBySubjectTable.headersDef({});
			tableConfig.aoColumns = [];
			tableConfig.aoColumnDefs = [];

			function defaultColumns(col, index) {
				var column = headersDef[col];
				var columnDefs = {};
				tableConfig.aoColumns.push(column.column);
				columnDefs = column.columnDef;
				columnDefs.defaultContent = '';
				columnDefs.aTargets = [index];
				tableConfig.aoColumnDefs.push(columnDefs);

			}
			_.each(headers, defaultColumns);

			commonService.initDataTable(tableElm, tableConfig);
			commonService.adjustTableWidth();
		};
		
		this.initTable=function(tableElm,paramObj) {
			var tableConfig = angular.extend({}, commonService.getConfig(),examTable.config(commonService,paramObj));
			var headers = commonService.authenticateHeaders(examTable.headers),
			headersDef = examTable.headersDef({});
			tableConfig.aoColumns = [];
			tableConfig.aoColumnDefs = [];

			function defaultColumns(col, index) {
				var column = headersDef[col];
				var columnDefs = {};
				tableConfig.aoColumns.push(column.column);
				columnDefs = column.columnDef;
				columnDefs.defaultContent = '';
				columnDefs.aTargets = [index];
				tableConfig.aoColumnDefs.push(columnDefs);

			}
			_.each(headers, defaultColumns);

			commonService.initDataTable(tableElm, tableConfig);
			commonService.adjustTableWidth();
		};
		
		this.updateResult = function(params,successCb,errorCb){
			resultFactory.$update(params,successCb,errorCb);
    	};
	}

}());
