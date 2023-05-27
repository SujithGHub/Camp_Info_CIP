(function() {
    'use strict';
    /**
      * @author Ashokrajan
      */
    angular
        .module('cip.importfile')
        .controller('ImportFileController', ImportFileController);

    ImportFileController.$inject = ['$http', '$log', 'StandardService', 'AcademicService', 'FileDownloadService', '$mdToast','$scope', 'SharedService', 'DepartmentService', 'SectionService', 'RoleService', 'CommonService', '$state'];

    /* @ngInject */
    function ImportFileController($http, $log, standardService, academicService, fileDownloadService, $mdToast, $scope, sharedService, departmentService, sectionService, roleService, commonService, $state ) {
        var vm = this;
        vm.init = init;
        vm.mScope = [];
        vm.mScope.yearAndStandardList = {};
        vm.getSectionByClassId = getSectionByClassId;
        vm.mScope.getClassByDepartmentId = getClassByDepartmentId;
        vm.JSONtemplate = {'url' : "/app/importFile/views/importFileTemplate.html","title": "Download Template", "okText": "DOWNLOAD" };
        $scope.fileRequired = true;
        
        function init() {
        	vm.mScope.instituteType = sharedService.institute.instituteType;
        	getAcademic();
        	getStaffRoles();
			if(vm.mScope.instituteType == 'College') {
				getActiveDepartmentList();
			}
			else {
				getYearAndStandard();
			}
        }
        
        function getStaffRoles() {
        	roleService.getStaffRoles(successCb, errorCb);
        	function successCb(result) {
        		vm.mScope.staffRoleList = result;
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE getStaffRoleList:",error);
        	}
        }

        vm.downloadTemplate = function(data) {
        	fileDownloadService.downloadTemplate(data, vm.mScope.instituteType);
        }
        
        vm.fileUpload = function(formData, event) {
        	if(vm.iscsvFile == false ){
        		return vm.iscsvFile;
        	}
    		var data = new FormData();
    		data.append('file', vm.file[0].files[0]);
    		data.append('name', formData.name);
    		data.append('examName', formData.examName);
    		data.append("data", JSON.stringify(formData));
    		$http({
    			method: 'post',
    			url:  commonService.baseApi+'/bulk',
    			headers: {'Content-Type': undefined},
    			data: data,
    			transformRequest: function(data, headersGetterFunction) {
    				return data; 
    			}
    		}).success(function(data, status) {
    			var count = 0;
    			var keyArr = Object.keys( data);
    			for ( var i = 0; i < keyArr.length; i++) {
    				var val = data[keyArr[i]];
    				if(val.length){
    					count ++;
    				}
    			}
    			if(count){
    				vm.mScope.error  = data;
    				vm.JSONtemplate = {'url' : "/app/importFile/views/viewImportError.html","title": "Import File Error", "okText": "" };
    				vm.form = {};
    				$scope.$broadcast('modelForm');
    			}else{
    				$mdToast.show({
    					template: '<md-toast class="md-toast ng-scope md-dark-teal-theme md-top"><div class="md-toast-content success "><span flex="" role="alert" aria-relevant="all" aria-atomic="true" class="ng-binding flex">File Uploaded successfully !</span></div></md-toast>',
    					hideDelay: 5000,
    					position: 'top'
    				});
    				  $state.reload();
    			}

    		}).error(function(data, status) {

    		});
        }
        
        function getYearAndStandard() {
			standardService.getActiveStandard(successCb, errorCb);

			function successCb(result) {
				vm.mScope.yearAndStandardList = result.entityList;
				$log.debug("SUCCESS getActiveYearAndStandard:",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getActiveYearAndStandard:",error)
			}
		};
		
		function getAcademic() {
			academicService.getAcademic(successCb, errorCb);
			function successCb(result) {
				vm.mScope.academicList = result.entityList;
				var currentDate = new Date();
				for(var i=0;i<vm.mScope.academicList.length;i++){
					var fromDate = new Date(vm.mScope.academicList[i].fromDate);
					var toDate = new Date(vm.mScope.academicList[i].toDate);
					if(fromDate <= currentDate && currentDate <= toDate){
						vm.form = {};
						vm.form.academic = { id : vm.mScope.academicList[i].id};
					}
				}
				$log.debug("SUCCESS getAcademic",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getAcademic:",error)
			}
		};
		
		
		// Get semester by class year 
		vm.mScope.getSemesterByClassYear=function(id){
			
			for(var i=0; i<vm.mScope.yearAndStandardList.length;i++){
				if(vm.mScope.yearAndStandardList[i].id==id){
					vm.mScope.semestersLists=commonService.getSemesterByClassYear(vm.mScope.yearAndStandardList[i].name);
					i=i+vm.mScope.yearAndStandardList.length-1
				}
			}
		};		
		
		//Get active department list if institute type as college
		function getActiveDepartmentList() {
        	departmentService.getActiveDepartment(successCb, errorCb);
        	function successCb(result) {
        		vm.mScope.departmentList = result.entityList;
        		vm.mScope.semesterList = result.entity;
        		$log.debug("SUCCESS getActiveDepartmentList",result);
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE getActiveDepartmentList:",error)
        	}
        };
        
        function getClassByDepartmentId(id) {
        	standardService.getClassByDepartmentId({id}, successCb, errorCb);
        	function successCb(result) {
        		vm.mScope.yearAndStandardList = result.entityList;
        		$log.debug("SUCCESS getClassByDepartmentId",result);
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE getClassByDepartmentId:",error)
        	}
        };
        
        function getSectionByClassId(id) {
        	if(vm.form.name == 'Student')
        		sectionService.getSectionByStandardId({id}, successCb, errorCb);
        	function successCb(result) {
        		vm.mScope.sectionList = result.entityList;
        		$log.debug("SUCCESS getSectionByClassId",result);
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE getSectionByClassId:",error)
        	}
        };
        
    	$scope.readFile = function(element) {
           $scope.$apply(function(scope) {
            if($(element)[0].files.length){
                 $scope.fileName = $(element)[0].files[0].name;
            }   

            vm.file = angular.element(document.getElementById('fileInput'));
            var type = vm.file[0].files[0].type;
            var csvTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/comma-separated-values', 'text/csv', 'application/csv', 'application/excel', 'application/vnd.ms-excel', 'application/vnd.msexcel', 'text/anytext']
            var a = csvTypes.indexOf(type);

            if(csvTypes.indexOf(type) === -1){
            	vm.iscsvFile = false; 
            }else{
            	vm.iscsvFile = true; 
            }
            });
        };
        
        vm.clearFile = function() {
        	$scope.fileName = '';
        	$("#fileInput").val('');
         };
     
    }
})();