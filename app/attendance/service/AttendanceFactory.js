(function() {
	'use strict';

    angular
        .module('cip.attendance')
        .factory('AttendanceFactory', AttendanceFactory);

    AttendanceFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function AttendanceFactory($resource,commonService) {
        return $resource( commonService.baseApi+'/attendance', {}, {
            getClassList : {
            	url:  commonService.baseApi+'/classyear/active/status',
            	method: 'GET'
            },
            getStudentList : {
            	url:  commonService.baseApi+'/attendance/student?searchInfo=:searchInfo',
            	method: 'GET',
            	params:{searchInfo : "@searchInfo"},
            	isArray : true
            },
            saveAttendance : {
            	url:  commonService.baseApi+'/attendance/save',
            	method: 'POST'
            },
            updateAttendanceAndCorrectionRequest : {
            	url:  commonService.baseApi+'/attendance/correction',
            	method: 'PUT'
            }
        });
    }
})();