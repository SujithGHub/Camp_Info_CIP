(function() {
	'use strict';

    angular
        .module('cip.report')
        .factory('ReportFactory', ReportFactory);

    ReportFactory.$inject = [
        '$resource',
		'CommonService'
    ];

    function ReportFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/report', {}, {
           
        	getAttendanceCountByRollNo: {
        		url: commonService.baseApi+'/attendance/count/rollno?statusInfo=:statusInfo',
        		method:'GET',
        		params:{
        			statusInfo: '@statusInfo'
        		}
        	},
        	getExamsByRollNoAndAcademicYear: {
        		url: commonService.baseApi+'/examination/rollno/academic/?rollNo=:rollNo&academicId=:academicId',
        		method:'GET',
        		params:{
        			rollNo: '@rollNo',
        			academicId:'@academicId'
        		}
        	}
        });
    }
})();