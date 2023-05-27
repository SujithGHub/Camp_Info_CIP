(function() {
    'use strict';
    /**
     * @author Ashokrajan K
     */
    angular.module('cip.vehicle').controller('TrackVehicleController',
            TrackVehicleController);

    TrackVehicleController.$inject = [ '$log', '$scope','$mdToast', '$mdDialog', 'VehicleService', '$interval', 'NgMap', 'CommonService' ];

    /* @ngInject */
    function TrackVehicleController($log, $scope,$mdToast, $mdDialog, vehicleService, $interval, NgMap, commonService) {

        var vm = this;
        getCurrentLocation();
        vm.baseApi = commonService.baseApi;

        function getToast(type,message) {
            $mdToast.show({
                template: '<md-toast class="md-toast ng-scope md-dark-teal-theme md-top "><div class="md-toast-content '+ type +' "><span flex="" role="alert" aria-relevant="all" aria-atomic="true" class="ng-binding flex">' + message + '</span></div></md-toast>',
                hideDelay: 5000,
                position: 'top'
            });
        }

        // make interval call to get vehicle location
        // starts the interval
        vm.getVehicleTrips = function(selectedVehicle) {

            if (!selectedVehicle) {
                return;
            }

            getVehicleDetails(selectedVehicle.originalObject);
            // stops any running interval to avoid two intervals running at the same time
        };

        // stops the interval
        vm.stop = function() {
            $interval.cancel(vm.promise);
        };

        vm.startInterval = function(vehicleTripId) {
            vm.stop();

            // store the interval promise
            if(vehicleTripId?.tripStatus === 'START') {
                vm.getLatestLocation(vehicleTripId.id);
            }else{
                getToast("failure",'Vehicle not yet started,unable to load current location');
            }
            vm.promise = $interval(function() {
                vm.getLatestLocation(vehicleTripId.id);
            }, 5000);
        };
        
        $scope.$on('$destroy',function(){
            if(vm.promise)
                vm.stop();   
        });

        function getVehicleDetails(vehicle) {

            vm.positions = [];
            vehicleService.getByVehicleId({ id : vehicle.id }, successCb, errorCb);
            function successCb(result) {
                if (result.status && result.entity) {
                    vm.vehicleRouteTrip = result.entity.vehicleRouteTrips;
                }
            }
            function errorCb(error) {
                $log.debug("FAILURE getStudentsByVehicleId:", error);
            }
        }


        vm.getLatestLocation = function(vehicleRouteTripId) {
            console.log(vehicleRouteTripId)
            vehicleService.getLatestLocationByTripId({ id : vehicleRouteTripId }, successCb, errorCb);
            function successCb(result){
                vm.resultStatus = result.entity.vehicleRouteTrip;

                    vm.positions = [result.entity];
                    vm.map = {
                        center: [vm.positions[0].latitude,
                            vm.positions[0].longitude]
                    };

            }

            function errorCb(error) {
                $log.debug("FAILURE getLatestLocation:", error);
            }

        };

        function getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.$evalAsync(function() {

                        // Set current Location
                        vm.currentLocation = {
                            latitude : position.coords.latitude,
                            longitude : position.coords.longitude
                        };

                        // Make map center
                        vm.map = { center : [ vm.currentLocation.latitude, vm.currentLocation.longitude ]
                        };
                    })
                });
            }
        }

        vm.clearVehicleSearch = function(id) {
            vm.stop();
            $scope.$broadcast('angucomplete-alt:clearInput', id);
            vm.positions = [];
            vm.vehicleRouteTrip = [];

        }
    }
})();

//AIzaSyCoc8y3b3kWgLihWQI1YuhYVTmkt7zht5I