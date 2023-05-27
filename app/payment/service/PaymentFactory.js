(function() {
	'use strict';

    angular
        .module('cip.payment')
        .factory('PaymentFactory', PaymentFactory);

    PaymentFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function PaymentFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/payment/:id', {id:'@id'}, {
            $save: {
                url:  commonService.baseApi+'/payment/save',
                method: 'POST'
            }
        });
    }
})();