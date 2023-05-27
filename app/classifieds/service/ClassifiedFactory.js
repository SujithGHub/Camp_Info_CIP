(function() {
	'use strict';

    angular
        .module('cip.classifieds')
        .factory('ClassifiedFactory', ClassifiedFactory);

    ClassifiedFactory.$inject = [
        '$resource',
		'CommonService'
    ];

    function ClassifiedFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/classifieds/active', {}, {
        	$delete : {
        		url:  commonService.baseApi+'/classifieds/delete',
        		method: 'PUT'
        	},
        	removeImage : {
        		url:  commonService.baseApi+'/classifieds/remove',
        		method: 'PUT'
        	},
        	getDashboardClassified : {
        		url:  commonService.baseApi+'/classifieds/latest',
        		method: 'GET'}
        });
    }
})();