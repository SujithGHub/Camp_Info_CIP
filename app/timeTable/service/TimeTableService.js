(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name TimeTableService
     * @module cip.timeTable
     * @require $log
     * @description
     *
     * TimeTableService
     *
     * @author Deepa
     * @copyright
     */
  
    angular
        .module('cip.timeTable')
        .service('TimeTableService', TimeTableService);

    TimeTableService.$inject = [
        '$log',
        'TimeTableFactory'
     ];

    function TimeTableService($log,timeTableFactory) {
    	
    	this.getTimeTable = function(params,successCb,errorCb){
    		timeTableFactory.getTimeTable(params,successCb,errorCb);
    	};

    	this.getTimeTableByStaff = function(params,successCb,errorCb){
    		timeTableFactory.getTimeTableByStaff(params,successCb,errorCb);
    	};

    }

}());
