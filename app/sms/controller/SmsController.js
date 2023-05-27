(function() {
    'use strict';
    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.sms')
        .controller('SmsController', SmsController);

    SmsController.$inject = ['$log', '$http', '$location', 'SmsService', 'FileDownloadService', 'StandardService', 'SectionService', 'SharedService', 'DepartmentService','$state','$scope','CommonService'];

    /* @ngInject */
    function SmsController($log, $http, $location, smsService, fileDownloadService, standardService, sectionService, sharedService, departmentService,$state,$scope,commonService) {
        var vm = this;
       
        vm.broadCastSmsInit = function() {
        	vm.instituteType = sharedService.institute.instituteType;
        	if(vm.instituteType == 'School'){
        		getActiveYearAndStandard();
        	}
        	if(vm.instituteType == 'College'){
        		getDepartmentList();
        	}
        	
        }
        
        vm.sendGroupSms = function(data) {
        	smsService.sendGroupSms(data, successCb, errorCb);
        	function successCb(result){
        		$state.reload();
        		$log.debug("SUCCESS sendGroupSms:", result)
        	}
        	function errorCb(error){
        		$log.debug("FAILURE sendGroupSms:", error)
        	}
        }
        
        vm.sendBulkSMS = function(formData) {
        	var importData = new FormData();
        	vm.file = angular.element(document.getElementById('fileInput'));
    		importData.append('file', vm.file[0].files[0]);
        	importData.append('Message', formData.textMessage);
    		$http({
    			method: 'post',
    			url:  commonService.baseApi+'/sms/bulk',
    			headers: {'Content-Type': undefined},
    			data: importData,
    			transformRequest: function(data, headersGetterFunction) {
    				return data; 
    			}
    		}).success(function(data, status) {
    			//$rootScope.fileRequired = true;
    			$state.reload();
    			$log.debug("sendBulkSms:", data)
    		})
        }
        
        vm.sendBroadcastSMS = function(formData) {
        	var data = new FormData();
    		if(formData.classYear && formData.department && formData.section && formData.broadcastType == 'choose') {
    			data.append("broadCastOption","classAndSectionByCollege");
    			data.append("department",formData.department.id);
    		}else if(formData.classYear && formData.department && !formData.section && formData.broadcastType == 'choose') {
    			data.append("broadCastOption","classYearAndDept");
    			data.append("department",formData.department.id);
    		}else if(formData.classYear && !formData.department && !formData.section && formData.broadcastType == 'choose') {
    			data.append("broadCastOption","classYear");
    		}else if(formData.classYear && !formData.department && formData.section && formData.broadcastType == 'choose') {
    			data.append("broadCastOption","classAndSectionBySchool");
    		}else if(!formData.classYear && formData.department && !formData.section && formData.broadcastType == 'choose') {
    			data.append("broadCastOption","department");
    			data.append("department",formData.department.id);
    		}else if(formData.broadcastType == 'all'){
    			data.append("broadCastOption","all");
    		}
    		
    		//data.append("option",formData.broadcastType);
    		if(formData.classYear){
    			data.append("class",formData.classYear.id);
    		}
    		if(formData.section){
    			data.append("section",formData.section.id);
    		}
    		data.append("Message",formData.textMessage);
    		$http({
    			method: 'post',
    			url:  commonService.baseApi+'/sms/broadcast',
    			headers: {'Content-Type': undefined},
    			data: data,
    			transformRequest: function(data, headersGetterFunction) {
    				return data; 
    			}
    		}).success(function(data, status) {
    			$state.reload();
    			$log.debug("sendBroadcastSMS",data);
    		})
        }
        
        vm.csvFileDownload = function() {
        	var instituteType = "School";
        	fileDownloadService.downloadTemplate({name:"Sms"}, instituteType);
        }
        
        function getActiveYearAndStandard() {
        	standardService.getActiveStandard(successCb, errorCb);
			function successCb(result) {
				vm.standardList = result.entityList;
				$log.debug("SUCCESS getActiveYearAndStandard",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getActiveYearAndStandard:",error)
			}
		};
        
        vm.getSectionByStandard = function(form){
        	if(form.department && vm.instituteType == 'College') {
				sectionService.getCorrespondingAndIsRestrictSections({classYearId: form.classYear.id, departmentId: form.department.id}, successCb, errorCb);
				function successCb(result) {
					vm.sectionList = result;
					$log.debug("SUCCESS getSectionByStandard",result);
				}
				function errorCb(error) {
					$log.debug("FAILURE getSectionByStandard:",error)
				}
			} 
			 if(!form.department && vm.instituteType == 'School') {
				 sectionService.getSectionByStandardId({id: form.classYear.id},successCb, errorCb);
				function successCb(result) {
					vm.sectionList = result.entityList;
					$log.debug("SUCCESS getSectionByStandard",result);
				}
				function errorCb(error) {
					$log.debug("FAILURE getSectionByStandard:",error)
				}
			}
		};
		
		vm.getDeptByClassName = function(className){
			departmentService.getDeptByClassName({class : className},successCb, errorCb);

			function successCb(result) {
				vm.departmentsList = result.entityList;
				$log.debug("SUCCESS getDeptByClassName",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getDeptByClassName:",error)
			}
		};
		

		$scope.readFile = function(element) {
			$scope.$apply(function(scope) {
				if($(element)[0].files.length){
					$scope.fileName = $(element)[0].files[0].name;
				}   
			});
		};

		vm.clearFile = function() {
			$scope.fileName = '';
			$("#fileInput").val('');
		};

		var max = 150;
		$("#textMessage").keyup(function(e){
			var maximum = (max - $(this).val().length)
			if(maximum < 10 && maximum >= 1){
				$("#count").text("Characters left: " + maximum);
				$("#count").removeClass("font-success");
				$("#count").removeClass("fade-danger");
				$("#count").addClass("font-danger");
			}else if(maximum < 1){
				$("#count").text("Characters left: " + maximum);
				$("#count").removeClass("font-success");
				$("#count").removeClass("font-danger");
				$("#count").addClass("fade-danger");
			}else{
				$("#count").text("Characters left: " + maximum);
				$("#count").removeClass("font-success");
				$("#count").removeClass("fade-danger");
				$("#count").addClass("font-success");
			}

		});
		
		function getDepartmentList() {
			departmentService.getActiveDepartment(successCb, errorCb);
			function successCb(result) {
				vm.departmentsList = result.entityList;
				$log.debug("SUCCESS getDepartmentActive",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getDepartmentActive:",error)
			}
		};
		
		vm.getClassByDepartmentId = function(id){
			standardService.getClassByDepartmentId({id}, successCb, errorCb);
			function successCb(result) {
				vm.standardList = result.entityList;
				$log.debug("SUCCESS getClassByDepartmentId",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getClassByDepartmentId:",error)
			}
		};
    }
})();