(function() {
	'use strict';

    angular
        .module('cip.paymentGateway')
        .factory('PaymentGatewayFactory', PaymentGatewayFactory);

    PaymentGatewayFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function PaymentGatewayFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/paymentgateway', {}, {
        	$save: {
                url:  commonService.baseApi+'/paymentgateway',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/paymentgateway',
                method: 'put'
            },
            $delete: {
                url:  commonService.baseApi+'/paymentgateway/delete',
                method: 'put'
            }
        });
    }
})();