(function() {
	'use strict';
	/**
	 * @author Deepa
	 */
	angular
	.module('cip.attendance')
	.controller('AttendanceController', AttendanceController);

	AttendanceController.$inject = ['$log', '$http', 'CommonService', '$rootScope', '$compile', '$scope', 'AttendanceService', '$mdDialog', 'SharedService', 'AcademicService', 'DepartmentService', 'AttendanceCorrectionService', 'WorkPlanService', 'StandardService', 'SectionService', 'SubjectService', 'SystemService', 'NotificationService'];

	/* @ngInject */
	function AttendanceController($log, $http, commonService, $rootScope, $compile, $scope, attendanceService, $mdDialog, sharedService, academicService, departmentService, attendanceCorrectionService, workPlanService, standardService, sectionService, subjectService, systemService, notificationService) {
		var vm 								= this;
		vm.mScope 							= {};
		vm.init 							= init;
		vm.getClass      			        = getClass;
		vm.getSection						= getSection;
		vm.getSubject 						= getSubject;
		vm.getStudentList	    			= getStudentList;
		vm.getModal             			= getModal;
		vm.changeIcon 						= changeIcon;
		vm.getSemesterByClassYear 			= getSemesterByClassYear;
		vm.saveOrUpdateAttendance			= saveOrUpdateAttendance;
		vm.saveOrUpdateAttendanceCorrection = saveOrUpdateAttendanceCorrection;
		vm.getAttendanceDetail 				= getAttendanceDetail;
		vm.userDetails						= $rootScope.userInfo;
		vm.institute						= $rootScope.instituteInfo;
		vm.instituteType					= sessionStorage.getItem('instituteType');
		vm.attendanceType					= vm.institute.attendanceType;
		vm.hourCount						= vm.institute.hoursCount;
		vm.role								= sessionStorage.getItem('role');
		vm.openNav                          = openNav;
		vm.closeNav                         = closeNav;

		academicService.getCurrentAcademicYear(successCb, errorCb);
		function successCb(result) {
			vm.academicId = result.entity.id;
		}
		function errorCb(error) {
			$log.debug("FAILURE getCurrentAcademicYear:", error);
		}

		function init() {
			console.log(vm, "vm_init")
			if (vm.role == "ROLE_STAFF_HOD") {
				getActiveHodDepartment();
			}

			if(sharedService.studentDetails.attendanceDate != null){
				vm.form = {}
				vm.form.date       = sharedService.studentDetails.attendanceDate;
				vm.form.department = sharedService.studentDetails.department;
				getClass(vm.form.department);
				vm.form.classYear  = sharedService.studentDetails.classYear.id;
				vm.classYearName =	 sharedService.studentDetails.classYear.name;	
				if(vm.form.classYear) {
					vm.semestersLists = commonService.getSemesterByClassYear(vm.classYearName);
				}
				vm.form.semester   = sharedService.studentDetails.semester;
				getSection(vm.form.classYear);
				vm.form.section    = sharedService.studentDetails.section; 
				vm.form.hour       = sharedService.studentDetails.hour;
				getStudentList();
				sharedService.setAttendanceCorrectionDetails(null);
			}


			if (vm.instituteType == "College") {
				if (vm.role == 'ROLE_ADMIN' || (!vm.institute.restrictedAttendance && vm.role == 'ROLE_STAFF' ) || (!vm.institute.restrictedAttendance && vm.role == 'ROLE_STAFF_HOD')) {
					departmentService.getActiveDepartment(successCb, errorCb);
					function successCb(result) {
						vm.departments = result.entityList;
						vm.semesterList = result.entity;
					}
					function errorCb(error) {
						$log.debug("FAILURE:",error);
					}
				} else {
					departmentService.getActiveDepartmentIsRestrict(successCb, errorCb);
					function successCb(result) {
						vm.departments = result.entityList;
					}
					function errorCb(error) {
						$log.debug("FAILURE:",error);
					}
				}
			} else {
				if (vm.role == 'ROLE_ADMIN' || (!vm.institute.restrictedAttendance && vm.role == 'ROLE_STAFF') || (!vm.institute.restrictedAttendance && vm.role == 'ROLE_STAFF_HOD')) {
					attendanceService.getClassList(successCb, errorCb);
					function successCb(result) {
						vm.classYear = result.entityList;
					}
					function errorCb(error) {
						$log.debug("FAILURE:",error);
					}
				} else {
					standardService.getActiveStandardIsRestrict(successCb, errorCb);
					function successCb(result) {
						vm.classYear = result;
					}
					function errorCb(error) {
						$log.debug("FAILURE:",error);
					}
				}
			}
		}
		function getActiveHodDepartment() {
			systemService.getUser(successCb, errorCb);
			function successCb(result) {
				vm.form = {};
				vm.form.department = result.entity.staff.department.id;
				getClass(vm.form.department);
			}
			function errorCb(error) {
				$log.debug("FAILURE getUser:",error)
			}
		}

		function getClass(id) {
			if (vm.role == 'ROLE_ADMIN' || (!vm.institute.restrictedAttendance && vm.role == 'ROLE_STAFF') || (!vm.institute.restrictedAttendance && vm.role == 'ROLE_STAFF_HOD')) {
				standardService.getClassByDepartmentId({id}, successCb, errorCb);
				function successCb(result) {
					vm.classYear = result.entityList;
				}
				function errorCb(error) {
					$log.debug("FAILURE:",error);
				}
			} else {
				standardService.getClassYearByDepartmentIdIsRestrict({id}, successCb, errorCb);
				function successCb(result) {
					vm.classYear = result;
				}
				function errorCb(error) {
					$log.debug("FAILURE:",error);
				}
			}
		}

		function getSemesterByClassYear(id) {
			for (var i = 0; i < vm.classYear.length; i++) {
				if (vm.classYear[i].id == id) {
					vm.semestersLists = commonService.getSemesterByClassYear(vm.classYear[i].name);
					i += vm.classYear.length-i;
				}
			}
		}

		function getSection(id) {

			if (vm.role == 'ROLE_ADMIN' || (!vm.institute.restrictedAttendance && vm.role == 'ROLE_STAFF') || (!vm.institute.restrictedAttendance && vm.role == 'ROLE_STAFF_HOD')) {
				sectionService.getsectionByClassId({id}, successCb, errorCb );
				function successCb(result) {
					vm.sectionList = result.entityList;
				}
				function errorCb(error) {
					$log.debug("FAILURE:",error);
				}
			} else {
				sectionService.getsectionByClassYearIdIsRestrict({id}, successCb, errorCb);
				function successCb(result) {
					vm.sectionList = result;
				}
				function errorCb(error) {
					$log.debug("FAILURE:",error);
				}
			}
		}

		function getSubject() {
			var id = vm.form.classYear;
			subjectService.getSubjectByClassId({id}, successCb, errorCb);
			function successCb(result) {
				vm.subjectList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE:",error);
			}
		}
		function getStudentList() {
			var arr = [];
			arr.push(commonService.convertDateFormat(vm.form.date));
			arr.push(vm.form.classYear);
			arr.push(vm.form.section);
			if (vm.instituteType == "College") {
				arr.push(vm.form.department);
				arr.push(vm.form.semester);
			}
			arr.push(vm.form.hour);
			attendanceService.getStudentList({searchInfo:arr}, successCb, errorCb);
			function successCb(result) {
				vm.attendanceList    = result;	
				if(vm.form.hour == 'All' || vm.form.hour == 'AllSession') {
					vm.saveAttendanceBtn = !commonService.isEmpty(vm.attendanceList[0].id);
				} else {
					vm.saveAttendanceBtn = !commonService.isEmpty(vm.attendanceList[0]['hour' + vm.form.hour]);
			}
				
				vm.attendanceHour    = vm.form.hour;
			}

			function errorCb(error) {
				$log.debug("FAILURE:",error);
			}
		}

		function getModal(data, index, hour) {
			if (!(vm.role == 'ROLE_STAFF' && vm.institute.restrictedAttendance && vm.updated_status)) {
				$mdDialog.show({
					controller: function ($mdDialog) {
						var vm  = this;
						vm.hide = function () {
							$mdDialog.hide();
						};
						vm.showEvent = function(formData) {
							vm.hide();
							vm.attendanceList[vm.index][vm.hour] = formData.status;
						};
					},
					controllerAs: 'modal',
					templateUrl: '/app/attendance/views/create.html',
					parent: angular.element(document.body),
					bindToController: true,
					locals: {
						hour           : hour,
						index          : index,
						attendanceList : vm.attendanceList
					},
					scope      : $scope.$new(),
					targetEvent: data,
				});

			}
		}

		function changeIcon(data) {
			if (data == "ABSENT") {
				return "PRESENT";
			}
			return "ABSENT";
		}

		function saveOrUpdateAttendance(formData) {
			for (var i = 0; i < vm.attendanceList.length; i++) {
				if (vm.instituteType == "College") {
					vm.attendanceList[i].department = { id : formData.department};
					vm.attendanceList[i].semester   = formData.semester;
				}
				vm.attendanceList[i].classYear = { id : formData.classYear };
				vm.attendanceList[i].section   = { id : formData.section };
				vm.attendanceList[i].date      = commonService.convertDateFormat(formData.date);
			}
			if (vm.attendanceList[0].id) {
				$http.post( commonService.baseApi+'/attendance/update', vm.attendanceList)
				.success(function (data) {
					vm.attendanceList = [];
				});
			} else {
				$http.post( commonService.baseApi + '/attendance/save', vm.attendanceList)
				.success(function (data) {
					vm.attendanceList = [];
				});
			}
			$(".attendance-content").mCustomScrollbar("destroy");
		}

		function saveOrUpdateAttendanceCorrection(data) {
			data.attendanceDate = commonService.convertDateFormat(data.date);
			attendanceCorrectionService.saveAttendanceCorrection(data, successCb, errorCb);
			function successCb(result) {
				getStudentList();
				vm.getDashboardNotification();
			}
			function errorCb(error) {
				$log.debug("FAILURE saveOrUpdateAttendanceCorrection:",error);
			}
		}

		function getAttendanceDetail(data) {
			vm.initData = data;
			vm.initData.hour = vm.form.hour; 
			var id = vm.form.department;
			standardService.getClassYearByDepartmentIdIsRestrict({id}, successCb, errorCb);
			function successCb(result) {
				vm.classYear = result;
			}
			vm.initData.classYear = vm.classYear[0].name;
			vm.initData.semester  = vm.form.semester;
		}

		vm.updatedAttendance = function(data) {
			if(vm.instituteType == "College") {
				data.department = { id : vm.form.department };
				data.semester   = vm.form.semester;
			}
			data.classYear = { id : vm.form.classYear };
			data.section   = { id : vm.form.section };
			data.academic  = { id : vm.academicId };
			attendanceService.updateAttendanceAndCorrectionRequest(data, successCb, errorCb);
			function successCb(result) {
				vm.getDashboardNotification();
				getStudentList();
			}
			function errorCb(error) {
				$log.debug("FAILURE updateAttendanceAndCorrectionRequest:", error);
			}
		};
		
		vm.getDashboardNotification = function () {
			notificationService.getDashboardNotification(successCb, errorCb);
			function successCb(result){
				$rootScope.notificationList = result.notification;
				$rootScope.attendanceCorrectionList = result.attendanceCorrection;
			}
			function errorCb(error){
				$log.debug("FAILURE getNotificationList:",error)
			}
		}

		//Get work plan 
		vm.getWorkplanAndPendingPlan = function(data) {
			var formData = angular.copy(data);
			formData.planDate  = data.date;
			formData.classYear = formData.classYear;
			workPlanService.getWorkplanAndPendingPlanByDate(formData, successCb, errorCb);
			function successCb(result) {
				vm.mScope.workPlanDetail = result;
				commonService.triggerModelForm();
			}
			function errorCb(error) {
				$log.debug("FAILURE getPendingWorkPlanByDate:", error);
			}
		};

		vm.updateDailyWorkPlan = function(data) {
			for (var i = 0; i < vm.mScope.workPlanDetail.length; i++) {
				if (vm.mScope.workPlanDetail[i].status == "CLOSED") {
					vm.mScope.workPlanDetail[i].hour = vm.form.hour;
				}
			} 
			workPlanService.updateDailyPlan(vm.mScope.workPlanDetail, successCb, errorCb);
			function successCb(result) {
			}
			function errorCb(error) {
				$log.debug("FAILURE getSubjectBySemesterId:", error);
			}
		};

		function openNav() {
			document.getElementById("mySidenav").style.width = "240px";
			document.getElementById("main").style.marginLeft = "250px";
			document.getElementById("main").className = "col-md-9 col-sm-12 col-xs-12 pr-0";
			var height = $("#attanceHeader").height();
			document.getElementById("attanceTable").style.cssText  = "height : calc(80vh - "+ height+"px);overflow : auto";
		};

		function closeNav() {
			document.getElementById("mySidenav").style.width = "0";
			document.getElementById("main").style.marginLeft= "0";
			document.getElementById("main").className = "col-md-12 col-sm-12 col-xs-12 p-0";
			document.getElementById("attanceTable").style.cssText  = "height : calc(80vh - "+ height+"px);overflow : auto";
		};

		$scope.imageModel = function (imgUrl){
			var modalImageBackground = document.getElementById('myModal');
			modalImageBackground.style.display = "block";
			var modalImg = document.getElementById("img01");
			modalImg.src = imgUrl;
			var span = document.getElementsByClassName("closeModel")[0];
			span.onclick = function() { 
				modalImageBackground.style.display = "none";
			}
		};
	}
})();
