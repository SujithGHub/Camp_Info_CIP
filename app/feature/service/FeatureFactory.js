(function() {
	'use strict';

    angular
        .module('cip.feature')
        .factory('FeatureFactory', FeatureFactory);

    FeatureFactory.$inject = [
        '$resource',
		'CommonService'
    ];

    function FeatureFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/institute', {}, {
      
        	getInstituteList :{
        		url :  commonService.baseApi+'/institute',
        		method:'GET'
        	},
        	getRoles:{
        		url :  commonService.baseApi+'/role',
        		method:'GET',
        		isArray:true
        	},
        	getFeatures:{
        		url :  commonService.baseApi+'/feature',
        		method:'GET',
        		isArray:true
        	},saveRoleFeatures:{
        		url :  commonService.baseApi+'/feature/save',
        		method:'POST',
        		//isArray:true
        	},getFeaturesByRole: {
                url:  commonService.baseApi+'/rolefeature/tenant?tenantId=:tenantId&roleId=:roleId',
                method: 'GET',
                params:{
                	tenantId : '@tenantId',
                	roleId : '@roleId'
                }
            }
        });
    }
})();