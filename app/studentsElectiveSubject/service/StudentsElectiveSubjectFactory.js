(function() {
	'use strict';

    angular
        .module('cip.studentsElectiveSubject')
        .factory('StudentsElectiveSubjectFactory', StudentsElectiveSubjectFactory);

    StudentsElectiveSubjectFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function StudentsElectiveSubjectFactory($resource,commonService) {
        return $resource( commonService.baseApi+'/elective-subject', {}, {
            $save: {
                url:  commonService.baseApi+'/elective-subject',
                method: 'POST'
            }
        
        });
    }
})();

 
