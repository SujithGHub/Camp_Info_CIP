(function() {
    'use strict';

    /**

     */
    angular
        .module('cip')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise("/home");

        $stateProvider
            .state('home', {
                url: "/home",
                templateUrl: "app/system/views/home.html",
            })
            .state('profile', {
                url: "/profile",
                templateUrl: "app/system/views/profile.html",
            })
            /*.state('logout', {
                url: "/logout",
                templateUrl: "app/login/views/login.html",
            });*/
    }

})();
(function() {
    'use strict';

    /**

     */
    angular
        .module('cip')
        .run(run);

    run.$inject = [
    	'$rootScope',
        '$location'
    ];

    function run ($rootScope,$location, $locationChangeStart) {

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
        var publicPages = ['/login'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
        if (restrictedPage && !localStorage.getItem('jwt-token')) {
         $location.path('/login');
        }
    });

    	 $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);
    	 function locationChangeSuccess() {
         	if($location.path() == '/timeTable' || $location.path() == '/consolidatedmark' || $location.path() == '/trackVehicle') {
         		$rootScope.hideNotificationLayout = false;
			}else {
				$rootScope.hideNotificationLayout = true;
			}
         }
    }
})();
