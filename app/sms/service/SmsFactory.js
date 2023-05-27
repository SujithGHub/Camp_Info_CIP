(function() {
	'use strict';

    angular
        .module('cip.sms')
        .factory('SmsFactory', SmsFactory);

    SmsFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function SmsFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/sms', {}, {
        	sendGroupSms: {
                url:  commonService.baseApi+'/sms/sendGroupSMS',
                method: 'POST'
            }
        });
    }
})();