(function() {
	'use strict';

	/**
	 * @ngdoc Service
	 * @name ReportService
	 * @module cip.report
	 * @require $log,
	 * @description
	 *
	 * ResultService
	 *
	 * @author
	 * @copyright
	 */

	angular
	.module('cip.report')
	.service('ReportService', ReportService);

	ReportService.$inject = [
	                           '$log',
	                           'ReportFactory',
	                           'AcademicService'
	                           ];

	function ReportService($log,reportFactory,academicService) {
		
		this.getExamsByRollNoAndAcademicYear = function(params,successCb,errorCb) {
			reportFactory.getExamsByRollNoAndAcademicYear(params,successCb,errorCb);
		};
		
		this.getAttendanceCountByRollNo = function(params,successCb,errorCb) {
			reportFactory.getAttendanceCountByRollNo(params,successCb,errorCb);
		};
		
	}

}());
