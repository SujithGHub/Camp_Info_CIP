(function() {
    'use strict';
    /**
     * @author Gunasekaran Jayaraj
     */
    angular
        .module('cip.vehicle')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('vehicleTracking', {
                url: "/vehicle",
                templateUrl: "app/vehicle/views/vehicleList.html",
                controller: "VehicleController",
                controllerAs: "vehicleCtrl"
            }).state('trackVehicle', {
                url: "/trackVehicle",
                templateUrl: "app/vehicle/views/trackVehicle.html",
                controller: "TrackVehicleController",
                controllerAs: "trackVehicleCtrl"
            }).state('vehicleRoute', {
                url: "/vehicleRoute",
                templateUrl: "app/vehicle/views/vehicleRoutes.html",
                controller: "VehicleRouteController",
                controllerAs: "vehicleRouteCtrl"
            });
    }

})();