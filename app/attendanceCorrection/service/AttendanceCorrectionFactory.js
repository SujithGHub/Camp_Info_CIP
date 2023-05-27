(function() {
	'use strict';
	


    /**
     * @author Krishna
     */
	
    angular
        .module('cip.attendanceCorrection')
        .factory('AttendanceCorrectionFactory', AttendanceCorrectionFactory);

    AttendanceCorrectionFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function AttendanceCorrectionFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/attendancecorrection', {}, {
        	saveAttendanceCorrection : {
                url:  commonService.baseApi+'/attendancecorrection',
                method: 'POST'
            },
            
            updateAttendanceCorrection : {
                url:  commonService.baseApi+'/attendancecorrection',
                method: 'PUT'
            },
            
        });
    }
})();