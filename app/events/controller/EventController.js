(function() {
    'use strict';
    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.events')
        .controller('EventsController', EventsController);

    EventsController.$inject = ['$log', '$compile', '$http', 'EventService', '$mdDialog', '$scope', 'CommonService', '$mdToast'];

    /* @ngInject */
    function EventsController($log, $compile, $http, eventService, $mdDialog, $scope, commonService, $mdToast) {
        var vm = this;

        vm.init = init;
        vm.initViewEvent = initViewEvent;
        vm.mScope = {};
        var start = 0;
        var limit = 9;
        var searchValue='';
		var currentView = 1;
        var recordsPerView = 9;
        vm.viewMore = viewMore;
        vm.viewEvent = viewEvent;
		vm.eventList = [];
		vm.currentDate = new Date();

		$scope.updateOrDeleteEvent = function(type, tableId) {
			setTimeout(function(){ getValue(type, tableId); }, 0);
		};

		vm.deleteEvent = function(id){
			   var confirm = $mdDialog.confirm()
 	          .title('Are you sure want to delete?')
 	          .textContent('You will not be able to recover information!')
 	          .ok('yes, Please it!')
 	          .cancel('Cancel');

			   $mdDialog.show(confirm).then(function() {
				   eventService.deleteEvent(id, successCb, errorCb);
					function successCb(result){
						init();
						$log.debug("SUCCESS deleteEvent:",result)
					}
					function errorCb(error){
						$log.debug("FAILURE deleteEvent:",error)
					}
				 });
		}

		function getValue(type, tableId) {
			var data ={};
			var table = $(tableId).dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			if(type == "update") {
				data.eventDate = commonService.convertDatePickerFormat(data.eventDate);
				vm.initData = data;
				$scope.$broadcast('modelForm');
			}
			/*else if(type=='view'){
				$mdDialog.show({
					controller: 'SystemController',
					controllerAs: 'systemCtrl',
					templateUrl: '/app/system/views/viewDashboardEvent.html',
					parent: angular.element(document.body),
					bindToController: true,
					locals: {
						scopeValue: data
					},
					clickOutsideToClose:true
				})*/

			/*	if(data.image.length) {
					$("#imageList").empty();
					var html="";
					html += '<div class="" style="background:white!important">';
					html += '<a href="'+data.image[0].name+'" class="col-sm-6 fancybox" rel="gallery" style="padding-top:10px"><img class="fancy" src="'+data.image[0].name+'" style="width:100%;max-width: 100%;"></a><div class="col-sm-6" style="padding-top:15px;font-size:14px;text-align:justify"><div class="lv-title" style="font-size: 17px;">Date</div>'+data.eventDate+'<br><br><div class="lv-title" style="font-size: 17px;">Description</div>'+data.description+'</div></div>';
					html += '</div >';
					$("#imageList").append(html);
					var content=$("#imageList");
					$compile(content.contents())($scope);
					$("#imageList").show();
				}
				*/

				/*else if(!data.image.length){
					html = '<div class="" style="padding-top:15px;font-size:13px;text-align:justify"><p class="event-header" style="padding-top:8px;height:2px;">Date</p>'+data.eventDate+'<p class="event-header" style="height:2px;">Description</p>'+data.description+'</div>'
					$("#noImage").append(html);
					$("#noImage").show();
					$("#imageList").append(html);
					var content=$("#imageList");
					$compile(content.contents())($scope);
					$("#imageList").show();
				}*/

				/*$('#table-responsive').hide();
				$('#backButton').show();*/
			/*}*/
			else {
				vm.deleteEvent(data.id);
			}
		}

		vm.hideViewEvent = function() {
			$('#table-responsive').show();
			$('#backButton').hide();
			$("#imageList").hide();
		}

		vm.saveOrUpdateEvent = function(formData) {
			formData.eventDate = commonService.convertDateFormat(formData.eventDate);
			var data = new FormData();
			var i=1;
			$('.fileInput').each(function(){
				var  element=$(this);
				if(this.files[0] != undefined) {
					data.append("file", this.files[0]);
					i++;
				}
			});
			data.append("length",i-1);
			data.append("name",formData.name);
			data.append("status",formData.status);
			data.append("description",formData.description);
			data.append("eventDate",formData.eventDate);
			if(formData.id){
				data.append("id",formData.id);
				$http({
					method: 'post',
					url:  commonService.baseApi+'/events/update',
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
					url:  commonService.baseApi+'/events/save',
					headers: {'Content-Type': undefined},
					data: data,
					transformRequest: function(data, headersGetterFunction) {
						return data;
					}
				}).success(function(data, status) {
					var errorData  = [];
					errorData = data;
	        		if(errorData.eventCount != undefined){
	        			var confirm = $mdDialog.confirm()
	        			.title('Insufficient Memory Space!')
	        			.textContent("The maximum event storage capacity is 20. please make delete some event manually or else if you want auto delete click continue")
	        			.ok('continue!')
	        			.cancel('ok');
	        			$mdDialog.show(confirm).then(function() {
	        				eventService.autoDeleteEvent(successCb, errorCb);
	        				function successCb(){
	        					init();
	        					$log.debug("SUCCESS deleteAlbum:")
	        				}
	        				function errorCb(error){
	        					$log.debug("FAILURE deleteAlbum:",error)
	        				}
	        			});
	        		} else{
	    				$mdToast.show({
	    					template: '<md-toast class="md-toast ng-scope md-dark-teal-theme md-top"><div class="md-toast-content success"><span flex="" role="alert" aria-relevant="all" aria-atomic="true" class="ng-binding flex">Event save successfully !</span></div></md-toast>',
	    					hideDelay: 5000,
	    					position: 'top'
	    				});
	    				$('.fileInput').each(function(){
	    					this.value = "";
	    				});
	    				init();
	    			}
				})
			}
		}

		vm.mScope.readFile = function(element) {
			 $scope.$apply(function(scope) {
		            if($(element)[0].target.files.length){
		            	vm.mScope.upload = {fileName : $(element)[0].target.files[0].name, fileLength : $(element)[0].target.files.length};
		           }
		     });
	    };

	    vm.mScope.removeEventImage = function(data){
	    	var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');
			$mdDialog.show(confirm).then(function() {
				eventService.removeEventImage(data, successCb, errorCb)
				function successCb(result) {
					vm.mScope.mForm.image[0] = '';
					init();
					$log.debug("FAILURE removeEventImage:",result)
				}
				function errorCb(error){
					$log.debug("FAILURE removeEventImage:",error)
				}
			});
		}

	    vm.mScope.clearFile = function() {
	       vm.mScope.upload = "";
	       $("#fileInput").val('');
	    };

        function init() {
        	eventService.initTable('eventDataTable', 'event');
        };

        function initViewEvent() {
        /*	$('#table-responsive').show();*/
			$('#imageList').hide();
			$('#backButton').hide();
        /*	eventService.initTable('viewEventDataTable', 'viewEvent');*/
			vm.noOfRecords ="";
			eventService.getEventList({start :start,limit:limit,searchValue:searchValue},successCb,errorCb);
			function successCb(result){
				vm.totalCount = result.totalCount;
				vm.eventList.push.apply(vm.eventList, result.entityList);
				vm.noOfRecords += vm.eventList.length;
			}
			function errorCb(error){
				$log.debug("FAILURE initViewEvent:",error)
			}
        };

        function viewMore() {
            if (currentView < numOfViews()) {
                currentView++;
            }
			start = ((currentView-1) * recordsPerView);
			initViewEvent();
        }

        function numOfViews() {
            return Math.ceil(vm.totalCount / recordsPerView);
        }

		vm.getDateFormat = function(eventDate) {
			return new Date(eventDate);
		}

		function viewEvent(data){

			$mdDialog.show({
				controller: 'SystemController',
				controllerAs: 'systemCtrl',
				templateUrl: '/app/system/views/viewDashboardEvent.html',
				parent: angular.element(document.body),
				bindToController: true,
				locals: {
					scopeValue: data
				},
				clickOutsideToClose:true
			})
		}
    }
})();