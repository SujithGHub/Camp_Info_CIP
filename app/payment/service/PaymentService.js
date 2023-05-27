(function() {
	'use strict';

	/**
	 * @ngdoc Service
	 * @name PaymentService
	 * @module cip.payment
	 * @require $log,
	 * @description
	 *
	 * PaymentService
	 *
	 * @author
	 * @copyright
	 */

	angular
	.module('cip.payment')
	.service('PaymentService', PaymentService);

	PaymentService.$inject = [
	                          '$log',
	                          'CommonService',
	                          'PaymentTable',
	                          'PaymentFactory',
	                          'PaymentByFilterTable'
	                          ];

	function PaymentService($log, commonService, paymentTable,paymentFactory,paymentByFilterTable) {

		this.savePayment = function(params,successCb,errorCb){
			paymentFactory.$save(params,successCb,errorCb);
		};
		this.getPaymentById = function(params,successCb,errorCb){
			paymentFactory.get(params,successCb,errorCb);
		};
		this.initTable = function(tableElm,paramObj, url, formattedDate) {
			var tableConfig = angular.extend({}, commonService.getConfig(),paymentTable.config(commonService, commonService.baseApi+url,formattedDate));

			var headers = commonService.authenticateHeaders(paymentTable.headers),
			headersDef = paymentTable.headersDef({});
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
		
		this.initPaymentByFilterTable = function(tableElm,paramObj, url, formData) {
			var tableConfig = angular.extend({}, commonService.getConfig(),paymentByFilterTable.config(commonService, url,formData));

			var headers = commonService.authenticateHeaders(paymentByFilterTable.headers),
			headersDef = paymentByFilterTable.headersDef({});
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
	}

}());
