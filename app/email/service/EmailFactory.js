(function() {
	'use strict';

    angular
        .module('cip.email')
        .factory('EmailFactory', EmailFactory);

    EmailFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function EmailFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/email', {}, {
        	sendGroupEmail: {
                url:  commonService.baseApi+'/email/group',
                method: 'POST'
            }
        });
    }
})();