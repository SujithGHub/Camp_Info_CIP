(function() {
	'use strict';

    angular
        .module('cip.institute')
        .factory('InstituteFactory', InstituteFactory);

    InstituteFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function InstituteFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/institute', {}, {
            $save: {
                url:  commonService.baseApi+'/institute/save',
                method: 'PUT'
            },
            $update: {
                url:  commonService.baseApi+'/institute/update',
                method: 'PUT'
            },
            $delete: {
                url:  commonService.baseApi+'/institute/delete',
                method: 'PUT'
            },
            getCurrentAcademicYear : {
            	url:  commonService.baseApi+'/academic/current',
            	method: 'GET'
            },
            getInstituteListByInstituteName : {
            	url:  commonService.baseApi+'/institute/search?searchValue=:searchValue',
            	method: 'GET',
            	params:{
            		searchValue: '@searchValue'
            	}
            },
            getInstituteList : {
            	url:  commonService.baseApi+'/institute',
            	method: 'GET'
            }
        });
    }
})();