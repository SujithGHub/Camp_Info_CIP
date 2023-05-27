(function() {
	'use strict';

    angular
        .module('cip.academic')
        .factory('AcademicFactory', AcademicFactory);

    AcademicFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function AcademicFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/academic', {}, {
            $update: {
                url:  commonService.baseApi+'/academic/update',
                method: 'PUT'
            },
            getAcademic : {
            	url:  commonService.baseApi+'/academic/active',
            	method: 'GET'
            },
            getCurrentAcademicYear : {
            	url:  commonService.baseApi+'/academic/current',
            	method: 'GET'
            }
        });
    }
})();