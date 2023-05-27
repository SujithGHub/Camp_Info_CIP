(function() {
	'use strict';

    angular
        .module('cip.feesStructure')
        .factory('FeesStructureFactory', FeesStructureFactory);

    FeesStructureFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function FeesStructureFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/fees', {}, {
            $save: {
                url:  commonService.baseApi+'/fees',
                method: 'POST'
            },
            $update: {
                url:  commonService.baseApi+'/fees',
                method: 'PUT'
            },
            $delete: {
                url: commonService.baseApi+'/fees',
                method: 'DELETE'
            },
            getStudentsPaymentMode: {
                url:  commonService.baseApi+'/fees/payment/mode?classYear=:classYear&section=:section',
                method: 'GET',
                params: {
                    classYear:'@classYear',
                    section:'@section'
                }
            },
            saveStudentsPaymentMode: {
                url:  commonService.baseApi+'/fees/payment/mode?paymentMode=:paymentMode',
                method: 'POST',
                params: {
                    paymentMode:'@paymentMode'
                }
            }
        });
    }
})();