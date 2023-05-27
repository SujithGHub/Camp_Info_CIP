(function() {
	'use strict';

    angular
        .module('cip.section')
        .factory('SectionFactory', SectionFactory);

    SectionFactory.$inject = [
        '$resource',
		'CommonService'
    ];

    function SectionFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/section', {}, {
            $save: {
                url:  commonService.baseApi+'/section',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/section',
                method: 'PUT'
            },
	        getSectionByStandardType: {
	        		url: commonService.baseApi+'/section/standard/name?classYearName=:classYearName',
	        		method:'GET',
	        		params:{
	        			classYearName: '@classYearName'
	        		}
	        },
	        getSectionByDeptId: {
        		url: commonService.baseApi+'/section/class/name?classYearName=:classYearName&departmentId=:deptId',
        		method:'GET',
        		params:{
        			classYearName: '@classYearName',
        			deptId : '@deptId'	
        		}
	        },
	        getsectionByClassYearIdIsRestrict: {
				url:  commonService.baseApi+'/section/staff/:id',
				method: 'GET',
				isArray:true,
				params : {
					id : '@id'
				}
			},
			getCorrespondingAndIsRestrictSections: {
				url:  commonService.baseApi+'/section/restrict?classYearId=:classYearId&departmentId=:departmentId',
				method: 'GET',
	        	params : {
	        		departmentId : '@departmentId',
					classYearId : '@classYearId'	
				},
				isArray:true
			},
	        getsectionByClassId: {
	        	url:  commonService.baseApi+'/section/class/:id',
	        	method: 'GET',
	        	params : {
					id : '@id'
				}
	        },
	        getSectionByDepartmentAndClassAndRole: {
				url:  commonService.baseApi+'/section/class/department?classYearId=:classYearId&departmentId=:departmentId',
				method: 'GET',
	        	params : {
	        		classYearId : '@classYearId',
	        		departmentId : '@departmentId'
				}
			},
        });
    }
})();