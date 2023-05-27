(function() {
    'use strict';
angular.module("cip.message", []).config(['$provide', '$httpProvider', '$compileProvider','$logProvider', function ($provide, $httpProvider, $compileProvider, $logProvider) {
	$provide.factory('myHttpInterceptor', function($timeout,$q, $window,$rootScope, $injector) {
		var vm = this;
		vm.showSimpleToast = function(type, message) {
			var $mdToast = $injector.get('$mdToast');
			$mdToast.show({
				template: '<md-toast class="md-toast ng-scope md-dark-teal-theme md-top"><div class="md-toast-content '+ type +' "><span flex="" role="alert" aria-relevant="all" aria-atomic="true" class="ng-binding flex">' + message + '</span></div></md-toast>',
				hideDelay: 5000,
				position: 'top'
			});
		};

		return {

			'request': function (config) {
				if(!config.url.includes("html") && localStorage.getItem('jwt-token')!=null) {
					config.headers['Authorization'] = "Bearer" + localStorage.getItem('jwt-token'); 
				}

				if(config.hideLoader) {
					$rootScope.hideLoader = true;
				}
				return config;
			},
			'response': function(successResponse) {
				if (successResponse.config.method.toUpperCase() != 'GET') {
					if(successResponse.data.message){
						vm.showSimpleToast("success", successResponse.data.message+"!")
					}
					return successResponse;
				} else {
					return successResponse;
				}
			},

			'responseError': function(errorResponse) {
				switch (errorResponse.status) {
				case 401:
						if (errorResponse.data.messageCode == 13501 || errorResponse.data.messageCode == 13502 ||
							errorResponse.data.messageCode == 13503 || errorResponse.data.messageCode == 13505) {
							localStorage.clear();
							$rootScope.$broadcast(errorResponse.data.message);
							$rootScope.$broadcast('session_expire');
							$location.path = "/";
							break;
						}
						vm.showSimpleToast("failure", errorResponse.data.message);
						break;
					break;
				case 403:
					vm.showSimpleToast("failure", 'You don\'t have the right to do this');
					break;
				case 404:
					vm.showSimpleToast("failure", errorResponse.config.url+' Not Found');
					break;
				case 400:
					vm.showSimpleToast("failure", errorResponse.data.message);
					break;
				case 412:
					vm.showSimpleToast("failure", errorResponse.data.message);
					break;	
				case 500:
					vm.showSimpleToast("failure", errorResponse.data.message);
					break;
				default:
					//vm.showSimpleToast("failure", 'Error ' + errorResponse.status + ': ' + errorResponse.data);
				}

				return $q.reject(errorResponse);;
			}
		};
	});

	$httpProvider.interceptors.push('myHttpInterceptor');
}]).config(['$logProvider', function($logProvider){
	$logProvider.debugEnabled(false);
}])
})();