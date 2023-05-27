(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name SemesterService
     * @module cip.semester
     * @require $log,
     * @description
     *
     * SemesterService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.semester')
        .service('SemesterService', SemesterService);

    SemesterService.$inject = [
        '$log',
        'SemesterFactory',
        'SemesterTable',
        'CommonService'
     ];

    function SemesterService($log, semesterFactory, semesterTable, commonService) {
    	
    	this.saveSemester = function(params, successCb, errorCb) {
    		semesterFactory.save(params, successCb, errorCb);
    	};
    	this.updateSemester = function(params, successCb, errorCb) {
    		semesterFactory.$update(params, successCb, errorCb);
    	};
    	
    	this.initTable=function(tableElm,paramObj) {
          var tableConfig = angular.extend({}, commonService.getConfig(),semesterTable.config(commonService));

          var headers = semesterTable.headers,
              headersDef = semesterTable.headersDef({});
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
  	}
    }

}());