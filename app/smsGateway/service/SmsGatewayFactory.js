(function() {
	'use strict';

    angular
        .module('cip.smsGateway')
        .factory('SmsGatewayFactory', SmsGatewayFactory);

    SmsGatewayFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function SmsGatewayFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/smsgateway', {}, {
        	$save: {
                url:  commonService.baseApi+'/smsgateway',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/smsgateway',
                method: 'put'
            },
            $delete: {
                url:  commonService.baseApi+'/smsgateway/delete',
                method: 'put'
            },
            getInstituteSmsStatisticsReport: {
                url:  commonService.baseApi+'/smsgateway/statistics?instituteId=:instituteId&fromDate=:fromDate&toDate=:toDate',
                method: 'GET',
                params : {
                    instituteId: '@instituteId',
                    fromDate : '@section',
                    toDate : '@semester'
                }
            }
        });
    }
})();