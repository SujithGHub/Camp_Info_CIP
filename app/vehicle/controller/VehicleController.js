(function() {
    'use strict';
    /**
     * @author Gunasekaran Jayaraj
     */
    angular
        .module('cip.vehicle')
        .controller('VehicleController', VehicleController);

    VehicleController.$inject = ['$filter','$log', '$http', '$rootScope', '$scope', '$mdDialog', 'VehicleService', 'CommonService', 'FileDownloadService', 'VehicleTripRouteService', 'VehicleStudentService','SharedService'];

    /* @ngInject */
    function VehicleController($filter, $log, $http, $rootScope, $scope, $mdDialog, vehicleService, commonService, fileDownloadService, vehicleTripRouteService, vehicleStudentService,sharedService) {
        var vm = this;

        vm.init                            = init;
        vm.mScope                     = {};
        vm.saveOrUpdateVehicle     = saveOrUpdateVehicle;
        vm.mScope.vehicleStudents = [];
       
        
        if($rootScope.instituteInfo) {
            vm.mScope.instituteType = $rootScope.instituteInfo.instituteType;
        }
        
        function saveOrUpdateVehicle(formData) {
            
            if(formData.id) {
                vehicleService.updateVehicle(formData, successCb, errorCb);
            } else {
                vehicleService.saveVehicle(formData, successCb, errorCb);
            }
            function successCb(result) {
                init();
            }
            function errorCb(error) {
                $log.debug("FAILURE saveOrUpdateVehicle:",error)
            }
            
        };
        
        $scope.updateVehicle = function(type) {
            setTimeout(function(){ getValue(type); }, 0);
        };
        
        //Get edit and delete data from datatable
        function getValue(type) {
            var data ={};
            var table = $('#vehicleTable').dataTable();
            $(".selected", table.fnGetNodes()).each(function() {
                data = table.fnGetData($(this).parents())
                $(this).removeClass('selected');
            });
            
            if(type == "update") {
                getVehicleById(vm.updateActionCallback, data.id);
            } 
            else if(type == "upload") {
                getVehicleById(vm.studentUploadActionCallback, data.id);
            }
            else if(type == "delete") {
                vm.deleteVehicle(data);
            }
        };
        
        vm.updateActionCallback = function(resultData) {
            vm.initData = resultData;
            commonService.triggerModelForm();
        }
        
        vm.studentUploadActionCallback = function(resultData) {
            vm.mScope.vehicleStudents = [];
            if(resultData.vehicleRouteTrips && resultData.vehicleRouteTrips.length) {
                resultData.vehicleRouteTrip = resultData.vehicleRouteTrips[0];
                vm.mScope.getStudentsByVehicleId(resultData.vehicleRouteTrip.id)
            }
            vm.initData = resultData;
            $("#studentUploadBtn").click();
        }
        
        function getVehicleById(callBackMethod, vehicleId) {
            vehicleService.getByVehicleId({ id : vehicleId }, successCb, errorCb);
            function successCb(result) {
                callBackMethod(result.entity);
            }
            function errorCb(error) {
                $log.debug("FAILURE getVehicleTypes:",error);
            }
        }

        function init() {
            vm.mScope.instituteType = sharedService.institute.instituteType;
            getVehicleTypes();
            vehicleService.initTable('vehicleTable');
            vm.mScope.baseApi = commonService.baseApi;
        };
        
        function getVehicleTypes() {
            
            vehicleService.getVehicleTypes(successCb, errorCb);
            function successCb(result) {
                vm.mScope.vehicleTypes = result;
            }
            function errorCb(error) {
                $log.debug("FAILURE getVehicleTypes:",error);
            }
        }
        
        vm.mScope.getStudentsByVehicleId =  function(id) {
            vehicleStudentService.getStudentByTrip({id}, successCb, errorCb);
            function successCb(result) {
                vm.mScope.vehicleStudents = result.entityList;
            }
            function errorCb(error) {
                $log.debug("FAILURE getStudentsByVehicleId:",error);
            }
        }

        vm.deleteVehicle = function(data){
               var confirm = $mdDialog.confirm()
              .title('Are you sure want to delete?')
              .textContent('You will not be able to recover information!')
              .ok('yes, Please it!')
              .cancel('Cancel');

               $mdDialog.show(confirm).then(function() {
                   vehicleService.deleteVehicle(data, successCb, errorCb);
                    function successCb(result){
                        init();
                    }
                    function errorCb(error){
                        $log.debug("FAILURE delete Bus Tracking:",error);
                    }
                 });
        };
        
         vm.mScope.uploadStudents = function(data) {
             vm.mScope.mForm.isStudentTripRequired = false;
             if(!data.vehicleRouteTrip) {
                 vm.mScope.mForm.isStudentTripRequired = true;
                 return;
             }
             var formData = new FormData();
             formData.append('file', data.file);
             formData.append('vehicleId',  JSON.stringify(data.vehicleRouteTrip));
             $http({
                 method: 'post',
                 url:  commonService.baseApi+'/vehiclestudent/upload',
                 headers: {'Content-Type': undefined},
                 data: formData,
                 transformRequest: function(data, headersGetterFunction) {
                     return data; 
                 }
             }).success(function(data, status) {
                 vm.mScope.mForm.file = {};
                 vm.mScope.vehicleStudents = data.entityList;
             }).error(function(data, status) {
             });
         };
         
         vm.mScope.downloadTemplate = function() {
             // Send vehicle route id if exit
             vm.vehicleRouteId = "";
             if(vm.mScope.mForm.vehicleRouteTrip.vehicleRoute && vm.mScope.mForm.vehicleRouteTrip.vehicleRoute.id) {
                 vm.vehicleRouteId = vm.mScope.mForm.vehicleRouteTrip.vehicleRoute.id;
             }
             vm.downloadTemplateDetail = {"name":"VehicleStudents","vehicleRoute":{"id":vm.vehicleRouteId}}
             fileDownloadService.downloadTemplate(vm.downloadTemplateDetail);
         }
         
         vm.mScope.addStudentToVehicle = function(vehicleDetails, vehicleStudent) {
             vm.mScope.mForm.isStudentRollNumberRequired = false;
             vm.mScope.mForm.isStudentTripRequired = false;
             if(!vehicleStudent || !vehicleStudent.student) {
                 vm.mScope.mForm.isStudentRollNumberRequired = true;
                 return;
             }
             
            vm.vehicleStudent = {"vehicleRouteTrip": vehicleDetails.vehicleRouteTrip, "student": vehicleStudent.student.originalObject, "vehicleRouteStop": (vehicleStudent.stop && vehicleStudent.stop.originalObject) ? vehicleStudent.stop.originalObject : null};
           if(!vm.vehicleStudent.vehicleRouteTrip){
               if(!vm.vehicleStudent.vehicleRouteTrip) {
                   vm.mScope.mForm.isStudentTripRequired = true;
               }
               return;
           }
            vehicleStudentService.addStudentToVehicle(vm.vehicleStudent, successCb, errorCb);
             function successCb(result) {
                 $scope.$broadcast('angucomplete-alt:clearInput');
                 vm.mScope.getStudentsByVehicleId(vehicleDetails.vehicleRouteTrip.id);
             }
             function errorCb(error) {
                 $log.debug("FAILURE addStudentToVehcile:",error);
             }
         }
         
         vm.mScope.removeStudent = function(data) {
             vehicleStudentService.removeVehicleStudent({id: data.id}, successCb, errorCb);
              function successCb(result) {
                  vm.mScope.vehicleStudents = result.entityList;
              }
              function errorCb(error) {
                  $log.debug("FAILURE removeStudent:",error);
              }
          }
         
         vm.mScope.addTrip = function(trip) {
             vm.mScope.mForm.isTripRequired = false;
             if(!trip || !trip.name) {
                 vm.mScope.mForm.isTripRequired = true;
                 return;
             }
             
             if(!vm.mScope.mForm.vehicleRouteTrips) {
                 vm.mScope.mForm.vehicleRouteTrips = [];
             }
             vm.mScope.mForm.vehicleRouteTrips.push({"tripName": trip.name, "vehicleRoute": trip.route && trip.route.originalObject ? trip.route.originalObject : null});
             vm.mScope.mForm.trip = {};
             $scope.$broadcast('angucomplete-alt:clearInput', 'vehicleRouteAutoComplete');
         }
         
         vm.mScope.removeTrip = function(vehicleTrip, indexId) {
             if(!vehicleTrip.id) {
                 vm.mScope.mForm.vehicleRouteTrips.splice(indexId, 1);
             } else {
                 vehicleTripRouteService.deleteVehicleTripRoute({id:vehicleTrip.id}, successCb, errorCb);
                  function successCb(result) {
                      vm.mScope.mForm.vehicleRouteTrips.splice(indexId, 1);
                  }
                  function errorCb(error) {
                      $log.debug("FAILURE addStudentToVehcile:",error);
                  }
             }
         }

        vm.mScope.readFile = function(element) {
            vm.mScope.mForm.file = {};
            if(fileValidation(element,element.target.files)){
                $scope.$apply(function(scope) {
                    if($(element)[0].target.files.length){
                        angular.forEach(element.target.files, function(value, key) {
                            vm.mScope.mForm.file = value ;
                        });

                    }
                });
                vm.mScope.uploadStudents(vm.mScope.mForm);
            }
        };

        vm.mScope.dropFile = function(files) {
            vm.mScope.upload = "";
            vm.mScope.mForm.file = {};
            angular.forEach(files, function(value, key) {
                vm.mScope.mForm.file= value;
            });
            vm.mScope.uploadStudents(vm.mScope.mForm);
            /*$scope.$apply(function(scope) {
                    vm.mScope.upload = {fileName : files[0].name, fileLength : files.length};
                }
            );*/
        }
        function fileValidation (element,files) {
            var count = 0 ;var filesLength = files.length;
            var acceptFormat = element.target.attributes.accept.value.split(",");
            for(var fileIndex = 0; fileIndex < files.length; fileIndex++) {
                for (var index = 0; index < acceptFormat.length; index++) {
                    if (files[fileIndex].type === acceptFormat[index]) {
                        count += 1;
                    }
                }
            }
            if(count == filesLength) {
                $( "#dragAndDropError" ).remove();
                return true;
            } else {
                //filesExtensionsCollecter(acceptFormat);
                $( "#dragAndDropError" ).remove();
                $('#dropzone').after('<div id="dragAndDropError" class="has-error"><small class="errormessage">The file is invalid,or not supported.</small></div>');
            }
            return false;
        }
    }
})();