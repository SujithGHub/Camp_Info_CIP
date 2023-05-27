(function() {
	'use strict';

    angular
        .module('cip.notification')
        .factory('NotificationFactory', NotificationFactory);

    NotificationFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function NotificationFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/notification', {}, {
        	$save: {
                url:  commonService.baseApi+'/notification',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/notification',
                method: 'PUT'
            },
            $delete: {
                url:  commonService.baseApi+'/notification/delete',
                method: 'PUT'
            },
            getDashboardNotification: {
            	url:  commonService.baseApi+'/notification/latest',
            	method: 'GET'
            }
        });
    }
})();