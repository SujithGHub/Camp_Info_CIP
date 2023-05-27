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
        .module('cip.consolidatedMark')
        .service('ConsolidatedMarkService', ConsolidatedMarkService);

    ConsolidatedMarkService.$inject = [
        '$log',
        'ConsolidatedMarkFactory'
     ];

    function ConsolidatedMarkService($log,consolidatedMarkFactory) {
    	
    	this.getStudentConsolidatedMark = function(params,successCb,errorCb) {
    		consolidatedMarkFactory.getStudentConsolidatedMark(params,successCb,errorCb);
    	};

    }

}());
