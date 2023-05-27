(function() {
	'use strict';

	angular
	.module('cip.standard')
	.factory('StandardFactory', StandardFactory);

	StandardFactory.$inject = [ '$resource','CommonService' ];

	function StandardFactory($resource,commonService) {

		return $resource( commonService.baseApi+'/standard', {}, {
			$save : {
				url:  commonService.baseApi+'/classyear',
				method: 'POST'
			},
			$update : {
				url:  commonService.baseApi+'/classyear',
				method: 'PUT'
			},
			getActiveStandard: {
				url:  commonService.baseApi+'/classyear/active/status',
				method: 'GET'
			},
			getCommonStandard: {
				url:  commonService.baseApi+'/classyear/unique',
				method: 'GET'
			},
			getClassByDepartmentId: {
				url:  commonService.baseApi+'/classyear/department/:id',
				method: 'GET',
				params : {
					id : '@id'
				}
			},
			getClassYearByConstant:{
				url:  commonService.baseApi+'/classyear/names',
				method: 'GET',
				isArray: true
			},
			getActiveStandardIsRestrict: {
				url:  commonService.baseApi+'/subjectallotment/staff/standards',
				method: 'GET',
				isArray: true
			},
			getClassYearByDepartmentIdIsRestrict: {
				url:  commonService.baseApi+'/classyear/department/staff/:id',
				method: 'GET',
				isArray:true,
				params : {
					id : '@id'
				}
			},
			getCorrespondingAndIsRestrictClassYears: {
				url:  commonService.baseApi+'/classyear/restrict/:id',
				method: 'GET',
				isArray:true,
				params : {
					id : '@id'
				}
			},
            getClassYearByRole:{
				url:  commonService.baseApi+'/classyear/role',
				method: 'GET',
			},
            getClassYearsByDepartmentAndStaff:{
                url: commonService.baseApi+'/subjectallotment/department/:id',
                method: 'GET',
                isArray:true,
                params : {
                    id : '@id'
                }
            },
			getClassYearByDepartmentAndRole:{
	              url:  commonService.baseApi+'/classyear/department/role/:id',
	              method: 'GET',
	              params : {
	                 id : '@id'
	              }
	        }
		});
	}
})();