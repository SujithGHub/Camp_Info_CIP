(function() {
	'use strict';

    /**
     * 
     */
	
    angular
        .module('cip.workPlan')
        .factory('WorkPlanFactory', WorkPlanFactory);

    WorkPlanFactory.$inject = [
        '$resource','CommonService'
    ];

    function WorkPlanFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/workplan', {}, {
            update : {
                method: 'PUT'
            },
            updateDailyPlan : {
            	url :  commonService.baseApi+'/workplan/update',
                method: 'PUT'
            },
            getPendingWorkPlanListByDate : {
            	url :  commonService.baseApi+'/workplan/pending',
                method: 'GET'
            },
            getWorkplanAndPendingPlanByDate : {
            	url :  commonService.baseApi+'/workplan/pending/date',
                method: 'GET',
                isArray:true
            },
            downloadWorkPlanExcel : {
            	url :  commonService.baseApi+'/workplan/dailyplan?start=0&limit=0&searchValue=',
                method: 'GET'
            },
            getWorkPlanReport : {
            	url :  commonService.baseApi+'/workplan/report',
                method: 'GET',
                isArray: true,
            },
        });
    }
})();