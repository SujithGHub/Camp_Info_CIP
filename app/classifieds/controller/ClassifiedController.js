(function() {
    'use strict';
    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.classifieds')
        .controller('ClassifiedController', ClassifiedController);

    ClassifiedController.$inject = ['$log', '$http', 'ClassifiedService', '$mdDialog', '$scope', 'SharedService','CommonService'];

    /* @ngInject */
    function ClassifiedController($log, $http, classifiedService, $mdDialog, $scope, sharedService,commonService) {
        var vm = this;

        vm.init = init;
        vm.classifiedDescription = classifiedDescription;
        vm.mScope = {};
        
        vm.saveOrUpdateClassified = function(formData) {
        	var data = new FormData();
    		var i=1;
    		$('.fileInput').each(function() {
    			var  element=$(this);
    			if(this.files[0] != undefined) {
    				data.append("file", this.files[0]);
    				i++;
    			}
    		});
    		data.append("length",i-1);
    		data.append("title",formData.title);
    		data.append("category",formData.category);
    		data.append("description",formData.description);
    		data.append("contactNumber", formData.contactNumber);
    		data.append("status",formData.status);
    		
    		if(formData.id){
    			data.append("id",formData.id);
    			$http({
    				method: 'post',
    				url:  commonService.baseApi+'/classifieds/update',
    				headers: {'Content-Type': undefined},
    				data: data,
    				transformRequest: function(data, headersGetterFunction) {
    					return data; 
    				}
    			}).success(function(data, status) {
    				$('.fileInput').each(function(){
    					this.value = "";
    				});
    				init();
    			})
    		}else{
    			data.append("id","");
    			$http({
    				method: 'post',
    				url:  commonService.baseApi+'/classifieds/save',
    				headers: {'Content-Type': undefined},
    				data: data,
    				transformRequest: function(data, headersGetterFunction) {
    					return data; 
    				}
    			}).success(function(data, status) {
    				$('.fileInput').each(function(){
    					this.value = "";
    				});
    				init();
    			})
    		}
        }
        
        $scope.updateOrDeleteClassified = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};

		vm.deleteClassified = function(data){
			   var confirm = $mdDialog.confirm()
 	          .title('Are you sure want to delete?')
 	          .textContent('You will not be able to recover information!')
 	          .ok('yes, Please it!')
 	          .cancel('Cancel');

			   $mdDialog.show(confirm).then(function() {
				   classifiedService.deleteClassified(data, successCb, errorCb);
					function successCb(result){
						init();
					}
					function errorCb(error){
						$log.debug("FAILURE deleteClassified:",error)
					}
				 });
		}
		
		vm.mScope.removeClassifiedImage = function(data) {
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');
			$mdDialog.show(confirm).then(function() {
				classifiedService.removeImage(data, successCb, errorCb)
				function successCb(result) {
					vm.mScope.mForm.image[0] = '';
					init();
					$log.debug("FAILURE removeClassifiedImage:",result)
				}
				function errorCb(error){
					$log.debug("FAILURE removeClassifiedImage:",error)
				}
			});
		}

		function getValue(type) {
			var data ={};
			var table = $('#classifiedDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			if(type == "update") {
				vm.initData = data;
				$scope.$broadcast('modelForm');
			}
			else if(type == "view") {
				classifiedDescription(data);
			}
			else 
				vm.deleteClassified(data);
		}
		
		function classifiedDescription(data) {
			$mdDialog.show({
				controller: ClassifiedController,
				controllerAs: 'classifiedCtrl',
				templateUrl: '/app/classifieds/views/classifiedDescription.html',
				parent: angular.element(document.body),
				bindToController: true,
				locals: {
					formData: data
				},
				clickOutsideToClose:false
			})
		}

		vm.cancel = function() {
			$mdDialog.cancel();
		}

        function init() {
        	vm.userRole=sharedService.userDetails.roles[0].name;
        	if(vm.userRole == 'ROLE_ADMIN') {
        		var url = "/classifieds";
        	}else{
        		var url = "/classifieds/user";
        	}
        	classifiedService.initTable('classifiedDataTable', url);
        	$(".content").mCustomScrollbar({theme:"dark-3", axis:"y"});
        };

        vm.viewClassifieds = function() {
        	classifiedService.getViewClassified(successCb, errorCb);
			function successCb(result){
				vm.activeClassifiedsList = result.entityList;
			}
			function errorCb(error){
				$log.debug("FAILURE deleteClassified:",error)
			}
        };
        
    	vm.mScope.readFile = function(element) {
			 $scope.$apply(function(scope) {
		            if($(element)[0].target.files.length){
		            	vm.mScope.upload = {fileName : $(element)[0].target.files[0].name, fileLength : $(element)[0].target.files.length};
		           }   
		     });
	    };
	        
	    vm.mScope.clearFile = function() {
	       vm.mScope.upload = "";
	       $("#fileInput").val('');
	    };
        
    	vm.elapsedTime = function(date) {
    		var classifiedDate = new Date(date);
    		var classifiedTime = classifiedDate.getTime();
    		var now = new Date();
    		var currentTime = now.getTime();
    		var millis = currentTime - classifiedTime;
    		var seconds = millis/1000;
    		if(seconds<60){
    			if(parseInt(seconds) == '1'){
    				return parseInt(seconds)+" Second";
    			}
    			else{
    				return parseInt(seconds)+" Seconds";
    			}
    		}
    		var minutes = seconds/60;
    		if(minutes<60){
    			if(parseInt(minutes) == '1'){
    				return parseInt(minutes)+" Min";
    			}
    			else{
    				return parseInt(minutes)+" Mins";
    			}
    		}
    		var hour = minutes/60;
    		if(hour<24){
    			if(parseInt(hour) == '1'){
    				return parseInt(hour)+" Hour";
    			}
    			else{
    				return parseInt(hour)+" Hours";
    			}
    		}
    		var days = hour/24;
    		if(parseInt(days) == '1'){
    			return parseInt(days)+" Day";
    		}
    		else{
    			return parseInt(days)+" Days";
    		}
    	}
    }
})();