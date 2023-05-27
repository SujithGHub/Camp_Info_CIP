(function() {
	'use strict';

    angular
        .module('cip.smtp')
        .factory('SmtpFactory', SmtpFactory);

    SmtpFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function SmtpFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/smtp/config', {}, {
        	$save: {
                url:  commonService.baseApi+'/smtp/config',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/smtp/config',
                method: 'put'
            },
            $delete: {
                url:  commonService.baseApi+'/smtp/config/delete',
                method: 'put'
            }
        });
    }
})();