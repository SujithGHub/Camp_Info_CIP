(function() {
	'use strict';

    angular
        .module('cip.attendanceAnalysis')
        .factory('AttendanceAnalysisFactory', AttendanceAnalysisFactory);

    AttendanceAnalysisFactory.$inject = [
        '$resource',
		'CommonService'
    ];

    function AttendanceAnalysisFactory($resource,commonService) {
        return $resource( commonService.baseApi+'/attendance', {}, {
        	getClassList : {
        		url:  commonService.baseApi+'/classyear/role',
        		method: 'GET'
        	},
        	getAttendanceDetails : {
        		url:  commonService.baseApi+'/attendance/rollno/search?searchInfo=:searchInfo',
        		method: 'GET',
        		params:{searchInfo : "@searchInfo"}
        	},

        
        });
    }
})();