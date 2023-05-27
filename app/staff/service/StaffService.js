(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name StaffService
     * @module cip.staff
     * @description
     *
     * StaffService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.staff')
        .service('StaffService', StaffService);

    StaffService.$inject = [
        'StaffFactory',
        'StaffTable',
        'CommonService'
     ];

    function StaffService(staffFactory, staffTable, commonService) {
    	
    	this.saveStaff = function(params,successCb,errorCb){
    		staffFactory.$save(params,successCb,errorCb);
    	};
    	this.updateStaff = function(params,successCb,errorCb){
    		staffFactory.$update(params,successCb,errorCb);
    	};
    	this.initTable=function(tableElm) {
    		commonService.setTableConfig(tableElm, staffTable, '/staff', true);
		};
    	
    }

}());
