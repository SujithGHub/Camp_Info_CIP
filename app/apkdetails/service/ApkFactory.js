(function() {
	'use strict';

    angular
        .module('cip.apkDetails')
        .factory('ApkDetailsFactory', ApkDetailsFactory);

    ApkDetailsFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function ApkDetailsFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/apkDetails', {}, {
        	$save: {
                url:  commonService.baseApi+'/apkDetails',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/apkDetails',
                method: 'put'
            },
            $delete: {
                url:  commonService.baseApi+'/apkDetails/deleteApkDetails',
                method: 'put'
            }
        });
    }
})();