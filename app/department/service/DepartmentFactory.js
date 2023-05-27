(function() {
	'use strict';

	angular
	.module('cip.department')
	.factory('DepartmentFactory', DepartmentFactory);

	DepartmentFactory.$inject = [
	                             '$resource',
		'CommonService'
	                             ];

	function DepartmentFactory($resource,commonService) {

		return $resource( commonService.baseApi+'/department', {}, {
			$update: {
				url:  commonService.baseApi+'/department',
				method: 'PUT'
			},
			getActiveDepartment: {
				url:  commonService.baseApi+'/department/active',
				method: 'GET'
			},
			getDeptByClassName: { 
				url:  commonService.baseApi+'/classyear/:class',
				method: 'GET',
				params : {
					class : "@class"
				}
			},
			getActiveDepartmentIsRestrict : {
				url:  commonService.baseApi+'/department/staff',
				method: 'GET'
			},
			getCorrespondingAndIsRestrictDepartments : {
				url:  commonService.baseApi+'/department/restricted',
				method: 'GET',
				isArray: true
			},
            getDepartmentByRole : {
                url:  commonService.baseApi+'/department/role',
                method: 'GET'
            },
		});
	}
})();