(function() {
	'use strict';

    angular
        .module('cip.viewAttendance')
        .factory('ViewAttendanceFactory', ViewAttendanceFactory);

    ViewAttendanceFactory.$inject = [
        '$resource','CommonService'
    ];

    function ViewAttendanceFactory($resource,commonService) {
        return $resource( commonService.baseApi+'/attendance', {}, {
        	
        	 getAttendanceReport : {
            	url:  commonService.baseApi+'/attendance/report?instituteType=:institute',
            	method: 'GET',
            	params:{institute : "@instituteType"}	 
            }
   
        });
    }
})();