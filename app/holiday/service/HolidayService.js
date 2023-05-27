(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name HolidayService
     * @module cip.holiday
     * @require $log,
     * @description
     *
     * HolidayService
     *
     * @author
     * @copyright
     */
  
    angular
        .module('cip.holiday')
        .service('HolidayService', HolidayService);

    HolidayService.$inject = [
        '$log',
        'HolidayFactory',
        'HolidayTable',
        'CommonService'
     ];

    function HolidayService($log, holidayFactory, holidayTable, commonService) {
    	
    	this.saveHoliday = function(params, successCb, errorCb){
    		holidayFactory.$save(params, successCb, errorCb);
    	};
    	this.updateHoliday = function(params, successCb, errorCb){
    		holidayFactory.$update(params, successCb, errorCb);
    	};
    	this.deleteHoliday = function(params, successCb, errorCb){
    		holidayFactory.$delete(params, successCb, errorCb);
    	};
    	this.getHolidayList = function(params, successCb, errorCb){
    		holidayFactory.getHolidayList(params, successCb, errorCb);
    	};
    	this.initTable=function(tableElm) {
    		commonService.setTableConfig(tableElm, holidayTable, '/holiday');
		};
    }

}());
