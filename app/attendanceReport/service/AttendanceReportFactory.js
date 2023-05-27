(function() {
	'use strict';

    angular
        .module('cip.attendanceReport')
        .factory('AttendanceReportFactory', AttendanceReportFactory);

    AttendanceReportFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function AttendanceReportFactory($resource,commonService) {
        return $resource( commonService.baseApi+'/attendance', {}, {
        	
        	 getAttendanceReport : {
            	url:  commonService.baseApi+'/attendance/attendanceReport?instituteType=:institute',
            	method: 'GET',
            	params:{institute : "@instituteType"}	 
            }, 
            getAttendancePercentage : {
            	url:  commonService.baseApi+'/attendance/percentage/rollno',
            	method: 'GET'
            },
            getAttendanceBySection : {
            	url:  commonService.baseApi+'/attendance/getStudentAttendanceBySection',
            	method: 'GET'
            },
            getMonthwiseAttendance : {
            	url:  commonService.baseApi+'/attendance/monthwise/report',
            	method: 'GET'
            }
        });
    }
})();