(function() {
    'use strict';
    /**
     * @author Ashokrajan K
     */
    angular.module('cip.vehicle').controller('VehicleRouteController', VehicleRouteController);

    VehicleRouteController.$inject = ['$log', 'VehicleRouteService','NgMap','$scope','CommonService', '$mdDialog','$rootScope'];

    /* @ngInject */
    function VehicleRouteController($log, vehicleRouteService, NgMap, $scope, commonService, $mdDialog,$rootScope) {

        var vm = this;

        vm.mScope = {};
        vm.saveOrUpdateVehicleRoute = saveOrUpdateVehicleRoute;
        $rootScope.hideNotificationLayout = true;
        vm.mScope.routeStop = false;
        vm.init = init;
         NgMap.getMap().then(function(map) {
            vm.map = map;
        });
        function init() {
            vehicleRouteService.initTable('vehicleRouteTable');
            getCurrentLocation();
        };

        function getCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    $scope.$evalAsync(function () {

                        // Set current Location
                        vm.currentLocation = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };

                        // Make map center
                        vm.mScope.map = {
                            center: [vm.currentLocation.latitude, vm.currentLocation.longitude]
                        };
                    })
                });
            }
        }

        vm.onclickGetLocation = function (event) {
            var position = {};
            var vehicleRouteStopsLength = $scope.routeForm.vehicleRouteStops.length;
            position.latitude = event.latLng.lat();
            position.longitude = event.latLng.lng();
            for (var startingposition = 0; startingposition < vehicleRouteStopsLength; startingposition++) {
                if (!$scope.routeForm.vehicleRouteStops[startingposition].name || !$scope.routeForm.vehicleRouteStops[startingposition].latitude || !$scope.routeForm.vehicleRouteStops[startingposition].longitude) {
                    $scope.routeForm.vehicleRouteStops[startingposition].latitude = position.latitude;
                    $scope.routeForm.vehicleRouteStops[startingposition].longitude = position.longitude;
                    $scope.$apply();
                }
            }
        }

        vm.markerLocation = function(event,index){
            $scope.routeForm.vehicleRouteStops[index].latitude = event.latLng.lat();
            $scope.routeForm.vehicleRouteStops[index].longitude = event.latLng.lng();
        }
        vm.getClass = function (index) {
            if (!$scope.routeForm.vehicleRouteStops[index].name || !$scope.routeForm.vehicleRouteStops[index].latitude || !$scope.routeForm.vehicleRouteStops[index].longitude) {
                return 'active-row'
            }
            return null;
        }
        vm.removeStop = function (index) {
            if($scope.routeForm.vehicleRouteStops[index].id) {
                vm.deleteRouteStop($scope.routeForm.vehicleRouteStops[index].id,$scope.routeForm.id);
            } else {
                $scope.routeForm.vehicleRouteStops.splice(index, 1);
            }
            validateStopSubmission();
        }
        
        // Validate to show submit button to save stop
        // Validate to add stop where no empty stop row in stop list
        function validateStopSubmission() {
        	vm.isEnableSubmitStopBtn = false;
        	 vm.invalidaStopOrderRow = null;
        	 vm.validateStopFormValidation = true;
        	for (var startingposition = 0; startingposition < $scope.routeForm.vehicleRouteStops.length; startingposition++) {
                if (!$scope.routeForm.vehicleRouteStops[startingposition].id) {
                	vm.isEnableSubmitStopBtn = true;
                }
                if (!$scope.routeForm.vehicleRouteStops[startingposition].name || !$scope.routeForm.vehicleRouteStops[startingposition].latitude || !$scope.routeForm.vehicleRouteStops[startingposition].longitude) {
                    vm.invalidaStopOrderRow         = $scope.routeForm.vehicleRouteStops[startingposition].stopOrder;
                    vm.validateStopFormValidation = false;
                    break;
                }
            }
        	return vm.validateStopFormValidation;
        };

        vm.vehicleRouteStopsAdd = function (index) {
            if (validateStopSubmission()) {
                $scope.routeForm.vehicleRouteStops.splice(index + 1, 0, {});
                vm.isEnableSubmitStopBtn = true;
            }
        }

        function saveOrUpdateVehicleRoute(formData, requestType) {
        	if(requestType === "vehicleRouteStop" && !validateStopSubmission()) {
        		return;
        	}
            if (formData.id) {
                vehicleRouteService.update(formData, successCb, errorCb);
            } else {
                vehicleRouteService.save(formData, successCb, errorCb);
            }
            function successCb(result) {
                if(requestType === "vehicleRouteStop") {
                	vm.getByRouteId(formData.id);
                } else {
                	init();
                }
            }
            function errorCb(error) {
                $log.debug("FAILURE saveOrUpdateVehicleRoute:", error)
            }
        };

        $scope.updateVehicleRoute = function (type) {
            setTimeout(function () {
                getValue(type);
            }, 0);
        };

        function getValue(type) {
            var data = {};
            var table = $('#vehicleRouteTable').dataTable();
            $(".selected", table.fnGetNodes()).each(function () {
                data = table.fnGetData($(this).parents())
                $(this).removeClass('selected');
            });

            if (type == "update") {
                vm.initData = data;
                commonService.triggerModelForm();
            }
            else if (type == "upload") {
                vm.getByRouteId(data.id);
            }
            else if (type == "delete") {
                vm.deleteVehicleRoute(data);
            }
        };

        vm.deleteVehicleRoute = function (data) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete?')
                .textContent('You will not be able to recover information!')
                .ok('yes, Please it!')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                vehicleRouteService.delete(data, successCb, errorCb);
                function successCb(result) {
                    init();
                }
                function errorCb(error) {
                    $log.debug("FAILURE delete Vehicle Route:", error);
                }
            });
        };

        vm.getByRouteId = function (id) {
            vehicleRouteService.getByRouteId({id}, successCb, errorCb);
            function successCb(result) {
                vm.mScope.routeStop = true;
                $rootScope.hideNotificationLayout = false;
                $scope.routeForm = result;
                if ($scope.routeForm.vehicleRouteStops.length == 0) {
                	vm.isEnableSubmitStopBtn = true;
                	//Initialize stop order
                    $scope.routeForm.vehicleRouteStops = [{}];
                }
            }
            function errorCb(error) {
                $log.debug("FAILURE getRouteStopsByRouteId:", error);
            }
        }

        vm.deleteRouteStop = function (id,routeId) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete?')
                .textContent('You will not be able to recover information!')
                .ok('yes, Please it!')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                vehicleRouteService.deleteRouteStop({id}, successCb, errorCb);
                function successCb(result) {
                    vm.getByRouteId(routeId);
                }
                function errorCb(error) {
                    $log.debug("FAILURE delete route stop:", error);
                }
            });
        };

         vm.backToVehicleRoutes = function(){
             vm.mScope.routeStop = false;
             $rootScope.hideNotificationLayout = true;
         }
        vm.showInfowindow = function(e, stop) {
            if(stop.name) {
                vm.stopName = stop.name;
                vm.infoWindowStopOrder = stop.stopOrder;
                vm.map.showInfoWindow('foo-iw', "stopInfo"+vm.infoWindowStopOrder);
            }
        };
}
})();