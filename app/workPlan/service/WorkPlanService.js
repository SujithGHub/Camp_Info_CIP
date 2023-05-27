(function() {
	'use strict';

	/**
	 * @author Krishna
	 */

	angular
	.module('cip.workPlan')
	.service('WorkPlanService', WorkPlanService);

	WorkPlanService.$inject = [
		'WorkPlanFactory',
		'WorkPlanTable',
		'DailyPlanDetailTable',
		'CommonService',
		];

	function WorkPlanService(workPlanFactory, workPlanTable, dailyPlanDetailTable, commonService) {

		this.saveWorkPlan = function(params,successCb,errorCb) {
			workPlanFactory.save(params,successCb,errorCb);
		};
		this.updateWorkPlan = function(params,successCb,errorCb) {
			workPlanFactory.update(params,successCb,errorCb);
		};
		this.updateDailyPlan = function(params,successCb,errorCb) {
			workPlanFactory.updateDailyPlan(params,successCb,errorCb);
		};
		this.getPendingWorkPlanListByDate = function(params,successCb,errorCb) {
			workPlanFactory.getPendingWorkPlanListByDate(params,successCb,errorCb);
		};
		this.getWorkplanAndPendingPlanByDate = function(params,successCb,errorCb) {
			workPlanFactory.getWorkplanAndPendingPlanByDate(params,successCb,errorCb);
		};
		this.downloadWorkPlanExcel = function(params,successCb,errorCb) {
			workPlanFactory.downloadWorkPlanExcel(params,successCb,errorCb);
		};
		this.getWorkPlanReport = function(params,successCb,errorCb) {
			workPlanFactory.getWorkPlanReport(params,successCb,errorCb);
		};
		this.initDataTable=function(tableElm, data) {

			if(data) {
				var tableConfig = angular.extend({}, commonService.getConfig(),dailyPlanDetailTable.config(commonService, data));
				var headers = dailyPlanDetailTable.headers,
				headersDef = dailyPlanDetailTable.headersDef({});
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
			} else {
				commonService.setTableConfig(tableElm, workPlanTable, '/workplan');
			}
			
		};
	}
}());