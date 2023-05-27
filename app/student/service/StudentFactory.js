(function() {
	'use strict';

    angular
        .module('cip.student')
        .factory('StudentFactory', StudentFactory);

    StudentFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function StudentFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/student/rollno/:rollNo', {rollNo : '@rollNo'}, {
            $save: {
                url:  commonService.baseApi+'/student',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/student',
                method: 'PUT'
            },
            getStudentListByAcademic : {
            	url:  commonService.baseApi+'/student/academic',
                method: 'GET'
            },
            updateStudentAcademic : {
            	url:  commonService.baseApi+'/student/academic',
                method: 'PUT'
            },
            updatePassoutStudent : {
            	url:  commonService.baseApi+'/student/passout',
                method: 'PUT'
            }
            
        });
    }
})();