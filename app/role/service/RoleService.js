(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name RoleService
     * @module cip.role
     * @require $log,
     * @description
     *
     * RoleService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.role')
        .service('RoleService', RoleService);

    RoleService.$inject = [
        '$log',
        'RoleFactory',
        'RoleTable',
        'CommonService'
     ];

    function RoleService($log,roleFactory, roleTable, commonService) {
    	
    	this.getStaffRoles = function(successCb,errorCb){
    		roleFactory.getStaffRoles(successCb,errorCb);
    	};
    	this.getAllStaffRoles = function(successCb,errorCb){
    		roleFactory.getAllStaffRoles(successCb,errorCb);
    	};
    	   	
    	this.initTable=function(tableElm,paramObj) {
            var tableConfig = angular.extend({}, commonService.getConfig(),roleTable.config(commonService));
            var headers = roleTable.headers,
                headersDef = roleTable.headersDef({});
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
