(function() {
	'use strict';
	/**
	 * @author Ashokrajan
	 */
	angular
	.module('cip.holiday')
	.controller('HolidayController', HolidayController);

	HolidayController.$inject = ['$log', 'AcademicService', 'CommonService', 'HolidayService', '$mdDialog', '$scope', 'EventService', 'SharedService', 'ExaminationService','$mdToast'];

	/* @ngInject */
	function HolidayController($log, academicService, commonService ,holidayService, $mdDialog, $scope, eventService, sharedService, examinationService,$mdToast) {
		var vm = this;

		vm.init = init;
		vm.initDataTable = initDataTable(); 
		vm.initCalendar = initCalendar;
		vm.mScope = {};
		vm.holidayArray = [];
		vm.mScope.direction = {};
		
		vm.saveOrUpdateHoliday = function(data) {
			data.fromDate	=	commonService.convertDateFormat(data.fromDate);
			data.toDate		=	commonService.convertDateFormat(data.toDate);
			if ((Date.parse(data.fromDate) > Date.parse(data.toDate))) {
				$mdToast.show({
					template: '<md-toast class="md-toast ng-scope md-dark-teal-theme md-top"><div class="md-toast-content failure"><span flex="" role="alert" aria-relevant="all" aria-atomic="true" class="ng-binding flex">To date should be greater than From date !</span></div></md-toast>',
					hideDelay: 5000,
					position: 'top'
				});
		    } else {
		    	if(data.id)
					holidayService.updateHoliday(data, successCb, errorCb);
				else
					holidayService.saveHoliday(data, successCb, errorCb);
				function successCb(result){
					initDataTable();
					$log.debug("SUCCESS saveOrUpdateHoliday:",result)
				}
				function errorCb(error){
					$log.debug("FAILURE saveOrUpdateHoliday:",error)
				}
		    }
		}

		$scope.updateOrDeleteHoliday = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};

		vm.deleteHoliday = function(data){
			data.fromDate	=	commonService.convertDateFormat(data.fromDate);
			data.toDate		=	commonService.convertDateFormat(data.toDate);
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				holidayService.deleteHoliday(data, successCb, errorCb);
				function successCb(result){
					init();
					$log.debug("SUCCESS deleteHoliday:",result)
				}
				function errorCb(error){
					$log.debug("FAILURE deleteHoliday:",error)
				}
			});
		}

		function getValue(type) {
			var data ={};
			var table = $('#holidayDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			if(type == "update") {
				data.fromDate = commonService.convertDatePickerFormat(data.fromDate);
				data.toDate = commonService.convertDatePickerFormat(data.toDate)
				vm.initData = data;
				$scope.$broadcast('modelForm');
			}
			else {
				vm.deleteHoliday(data);
			}
		}


		function getAcademic() {
			academicService.getAcademic(successCb, errorCb);

			function successCb(result) {
				vm.mScope.academicList = result.entityList;
				$log.debug("SUCCESS getAcademic",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getAcademic:",error)
			}
		};

		function getLatestEvents() {
			eventService.getLatestEvents(successCb, errorCb);
			function successCb(result) {
				var eventList = result.entityList;
				for(var i=0;i<eventList.length;i++){
					var event = {};
					event.title = eventList[i].name;
					event.start = eventList[i].eventDate;
					event.end = eventList[i].eventDate;
					event.description = eventList[i].description;
					event.color = '#9a9a9a';
					event.event = eventList[i];
					vm.holidayArray.push(event);
				}
				getExam();
				$log.debug("SUCCESS getLatestEvents",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getLatestEvents:",error)
			}
		}

		function getExam() {
			if(sharedService.userDetails.roles[0].name == 'ROLE_USER')
				examinationService.getExamByStudent(successCb, errorCb);
			else
				examinationService.getExamList(successCb, errorCb);
			
				function successCb(result) {
				var examList = result.entityList;
				if(examList.length > 0) {
                    getExamPaperSchedule(0, examList.length, examList);
                } else {
                    getHolidayList();
                }
				/*for(var i=0;i<examList.length;i++){
					examinationService.getExamPaperById({id : examList[i].id}, successCb, errorCb);
					function successCb(result) {
						for(var k in result.entityList){
							result.entityList[k].description = examList[i].examName;
							result.entityList[k].title = result.entityList[k].subject.subjectName;
							result.entityList[k].start = result.entityList[k].date;
							result.entityList[k].end = result.entityList[k].date;
							result.entityList[k].color = '#009688';
							vm.holidayArray.push(result.entityList[k]);
						}
                        getHolidayList();
					}
					function errorCb(error) {
						$log.debug("FAILURE getLatestEvents:",error)
					}
				}*/

				$log.debug("SUCCESS getExam",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getExam:",error)
			}
		}

		 function getExamPaperSchedule(initialSize, totalSize, exams) {
            examinationService.getExamPaperById({id : exams[initialSize].id}, successCb, errorCb);
            function successCb(result) {
                for(var k in result.entityList){
                    result.entityList[k].description = exams[initialSize].examName;
					if(result.entityList[k].subjectElective.id){
						result.entityList[k].title = result.entityList[k].subjectElective.electiveSubjectName;
					}
					else{
                    result.entityList[k].title = result.entityList[k].subject.subjectName;
					}
                    result.entityList[k].start = result.entityList[k].date;
                    result.entityList[k].end = result.entityList[k].date;
                    result.entityList[k].color = '#009688';
                    vm.holidayArray.push(result.entityList[k]);
                }
                if(initialSize < totalSize-1) {
                    getExamPaperSchedule(initialSize + 1, totalSize, exams);
                } else {
                    getHolidayList();
                }
            }

            function errorCb(error) {
                $log.debug("FAILURE getLatestEvents:",error)
            }
		}

		function getHolidayList () {
			holidayService.getHolidayList(successCb, errorCb)
			function successCb(result) {
				var holidayList = result.entityList;
				for(var i=0;i<holidayList.length;i++){
					var holiday = {};
					holiday.title = holidayList[i].holidayName;
					holiday.start = moment(holidayList[i].fromDate).format('YYYY/MM/DD hh:mm');
					holiday.end =  moment(holidayList[i].toDate).format('YYYY/MM/DD hh:mm');
					holiday.description = holidayList[i].description;
					holiday.color = '#ff5722';
					vm.holidayArray.push(holiday);
				}
				var today = new Date();
				$('#calendar').fullCalendar({
					header:{
						left: '',
						center: 'prev title next',
						right: ''
					},

					defaultDate: today,
					aspectRatio: 2, 
					fixedWeekCount: false,
					displayEventTime: false,
					handleWindowResize: true,
					editable: true,
					eventLimit: true, // allow "more" link when too many events
					events: vm.holidayArray,
					columnFormat: 'dddd',
					allDay: true,
					eventClick: function(calEvent, jsEvent, view) {
						vm.calendarEvent = calEvent;
						if(vm.calendarEvent.color == '#4184F3'){
							$mdDialog.show({
								controller: function ($mdDialog) {
									var vm = this;
									vm.cancel = function () {
										$mdDialog.hide();
									};
								},
								controllerAs: 'modal',
								template: '<md-dialog aria-label="Notification" ng-cloak style="width: 50%;">'
								           +'<md-toolbar style="height: 38px; min-height: 40px!important;"><div class="md-toolbar-tools" style="height: 50px;min-height: 40px!important;"><h2>'+vm.calendarEvent.title+'</h2><span flex></span>'
								           +'<md-button class="md-icon-button" ng-click="modal.cancel()"><i class="zmdi zmdi-close zmdi-hc-fw ng-scope" style="color: white;"></i></md-button></div></md-toolbar>'
								           +'<md-dialog-content style="font-size:13px"><div class="md-dialog-content">'
								           +'<md-input-container><p>'+vm.calendarEvent.description+'</p> </md-input-container></div></md-dialog-content></md-dialog>',
								parent: angular.element(document.body),
								targetEvent: jsEvent,
								clickOutsideToClose: true
							});
						}
						else if(vm.calendarEvent.color == '#9a9a9a'){
							$mdDialog.show({
								controller: function ($mdDialog) {
									var vm = this;
									vm.cancel = function () {
										$mdDialog.hide();
									};
								},
								template: '<md-dialog aria-label="Notification" ng-cloak style="width: 50%;">'
							           +'<md-toolbar style="background-color:'+vm.calendarEvent.color+';height: 38px; min-height: 40px!important;">'
							           +'<div class="md-toolbar-tools" style="height: 50px;min-height: 40px!important;"><h2>'+vm.calendarEvent.title+'</h2><span flex></span>'
							           +'<md-button class="md-icon-button" ng-click="modal.cancel()">'
							           +'<i class="zmdi zmdi-close zmdi-hc-fw ng-scope" style="color: white;"></i></md-button></div></md-toolbar>' 
							           +'<md-dialog-content style="font-size:13px"><div class="md-dialog-content">'
							           +'<md-input-container><p>'+vm.calendarEvent.description+'</p> </md-input-container></div></md-dialog-content></md-dialog>',	
								controllerAs: 'modal',
								parent: angular.element(document.body),
								targetEvent: jsEvent,
								clickOutsideToClose: false
							});

						} else {
							$mdDialog.show({
								controller: function ($mdDialog) {
									var vm = this;
									vm.cancel = function () {
										$mdDialog.hide();
									};
								},
								controllerAs: 'modal',
								template: '<md-dialog aria-label="Notification" ng-cloak style="width: 50%;"><md-toolbar style="background-color:'+vm.calendarEvent.color+';height: 38px; min-height: 40px!important;">'
							           +'<div class="md-toolbar-tools" style="height: 50px;min-height: 40px!important;">'
							           +'<h2>'+vm.calendarEvent.title+'</h2><span flex></span><md-button class="md-icon-button" ng-click="modal.cancel()"><i class="zmdi zmdi-close zmdi-hc-fw ng-scope" style="color: white;"></i></md-button>'
							           +'</div></md-toolbar>'
							           +'<md-dialog-content style="font-size:13px"><div class="md-dialog-content">'
							           +'<md-input-container><p>'+vm.calendarEvent.description+'</p> </md-input-container>'	
							           +'</div></md-dialog-content></md-dialog>',	
								parent: angular.element(document.body),
								targetEvent: jsEvent,
								clickOutsideToClose: false
							});
						}
					}
				});
				$log.debug("SUCCESS getHolidayList",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getHolidayList:",error)
			}
		}
		
		function init() {
			getAcademic();
			initDataTable();
		};
		
		function initDataTable() {
			holidayService.initTable('holidayDataTable');
		};

		function initCalendar() {
			getLatestEvents();
		}
		
		vm.mScope.validateDate=function(dateFromType){
			vm.mScope.invalidDate = false;
			if(dateFromType == 'FROMDATE') {
				if(vm.mScope.mForm.toDate) {
					var fromDate	=	commonService.convertDateFormat(vm.mScope.mForm.fromDate);
					var toDate		=	commonService.convertDateFormat(vm.mScope.mForm.toDate);
					if ((Date.parse(fromDate) > Date.parse(toDate))) {
						vm.mScope.invalidDate = true;
					}
					
				}
			} else {
				if(vm.mScope.mForm.fromDate) {
					var fromDate	=	commonService.convertDateFormat(vm.mScope.mForm.fromDate);
					var toDate		=	commonService.convertDateFormat(vm.mScope.mForm.toDate);
					if ((Date.parse(fromDate) > Date.parse(toDate))) {
						vm.mScope.invalidDate = true;
					}
				}
			}
			
		}
	}
})();