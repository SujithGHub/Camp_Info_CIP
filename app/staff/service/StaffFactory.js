(function() {
	'use strict';

    angular
        .module('cip.staff')
        .factory('StaffFactory', StaffFactory);

    StaffFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function StaffFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/staff', {}, {
            $save: {
                url:  commonService.baseApi+'/staff',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/staff',
                method: 'PUT'
            }
        });
    }
})();