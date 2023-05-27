(function() {
    'use strict';
    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.email')
        .controller('EmailController', EmailController);

    EmailController.$inject = ['$log', 'EmailService', '$timeout','$http', 'FileDownloadService', 'StandardService', 'SectionService', 'SharedService', 'DepartmentService','$scope','$state','CommonService'];

    /* @ngInject */
    function EmailController($log, emailService, $timeout, $http, fileDownloadService, standardService, sectionService, sharedService, departmentService,$scope,$state,commonService) {
        var vm = this;
       
        vm.broadCastEmailInit = function() {
        	vm.instituteType = sessionStorage.getItem('instituteType');
        	if(vm.instituteType == 'School'){
        		getActiveYearAndStandard();
        	}
        	if(vm.instituteType == 'College'){
        		getDepartmentList();
        	}
        }

    	$scope.editorOptions = {height:'40vh',language: 'en',
    			toolbar: [
    			          { name: 'document', items: [ 'Source', '-', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
    			          { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
    			          { name: 'editing', items: [ ] },
    			          '/',
    			          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
    			          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
    			          { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
    			          { name: 'insert', items: ['Smiley', 'Table', 'HorizontalRule', 'SpecialChar', 'PageBreak'] },
    			          { name: 'styles', items: [ 'Format', 'Font', 'FontSize' ] },
    			          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
    			          ]
    	}
    	
        vm.csvFileDownload = function() {
        	var instituteType = "School";
        	fileDownloadService.downloadTemplate({name : "E-Mail"}, instituteType);
    	}

        vm.sendMail = function(formData, type) {
    		var imageUrls = [];
    		$('#htmlContent').append(formData.body);
    		var x = document.getElementById("htmlContent");
    		var imgElements = x.getElementsByTagName("img");
    		var i=0;
    		angular.forEach(imgElements, function(value, key){
    			imageUrls.push(value.src);
    			value.src = "cid:image"+i;
    			i++;
    		});

    		$timeout(function(){
    			formData.imageUrls = imageUrls;
    			formData.body = document.getElementById("htmlContent").innerHTML;
          document.getElementById("htmlContent").innerHTML = "";
    			if(type == 'groupemail')
    				vm.sendGroupEmail(formData);
    			else if(type == 'bulkEmail')
    				vm.sendBulkEmail(formData);
    			else
    				vm.sendBroadcastEmail(formData);
    		},300);
        }
        
        vm.sendGroupEmail = function(data) { 
        	emailService.sendGroupEmail(data, successCb, errorCb);
        	function successCb(result){
        		$state.reload();
        		$log.debug("SUCCESS sendGroupEmail:",result)
        	}
        	function errorCb(error){
        		$log.debug("FAILURE sendGroupEmail:",error)
        	}
        }
        
        vm.sendBulkEmail = function(data) {
        	var importData = new FormData();
        	vm.file = angular.element(document.getElementById('fileInput'));
    		importData.append('file', vm.file[0].files[0]);
        	importData.append('subject', data.subject);
    		importData.append('body', data.body);
    		importData.append('imageUrls', data.imageUrls);
    		$http({
    			method: 'post',
    			url:  commonService.baseApi+'/email/bulk',
    			headers: {'Content-Type': undefined},
    			data: importData,
    			transformRequest: angular.identity
    		}).success(function(data, status) {
    			$log.debug("sendBulkEmail:",data)
    			$state.reload();
    		})
    	}
        
    	vm.sendBroadcastEmail = function(formData){
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
    		
    		if(formData.classYear){
    			data.append("class",formData.classYear.id);
    		}
    		if(formData.section){
    			data.append("section",formData.section.id);
    		}
    		data.append("subject",formData.subject);
    		data.append("body",formData.body);
    		data.append("imageUrls",formData.imageUrls);
    		$http({
    			method: 'post',
    			url:  commonService.baseApi+'/email/broadcast',
    			headers: {'Content-Type': undefined},
    			data: data,
    			transformRequest: function(data, headersGetterFunction) {
    				return data; 
    			}
    		}).success(function(data, status) {
    			$state.reload();
    		})
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
		
		vm.getDeptByClassName = function(className){
			departmentService.getDeptByClassName({class : className},successCb, errorCb);

			function successCb(result) {
				vm.departmentsList = result.entityList;
				$log.debug("SUCCESS getDeptByClassName",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getDeptByClassName:",error)
			}
		}

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
			else if(!form.department && vm.instituteType == 'School') {
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