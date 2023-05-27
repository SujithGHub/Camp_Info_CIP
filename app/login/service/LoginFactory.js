(function() {
	'use strict';

    angular
        .module('cip.login')
        .factory('LoginFactory', LoginFactory);

    LoginFactory.$inject = [
        '$resource',
        'CommonService'
    ];

    function LoginFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/login', {}, {
        	getLoginImages :{
        		url :  commonService.baseApi+'/albums/login/images?institute=:institute',
        		method:'GET',
        		params : {
        			institute :'@institute'
        		}
        	}
        });
    }
})();