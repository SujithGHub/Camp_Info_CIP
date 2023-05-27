(function() {
	'use strict';

    angular
        .module('cip.role')
        .factory('RoleFactory', RoleFactory);

    RoleFactory.$inject = [
        '$resource',
		'CommonService'
    ];

    function RoleFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/role', {}, {
        	
        	getStaffRoles: {
				url:  commonService.baseApi+'/role/hierarchy',
				method: 'GET',
				isArray: true
			},
			getAllStaffRoles: {
				url:  commonService.baseApi+'/role/staff',
				method: 'GET',
				isArray: true
			},
     
        });
    }
})();