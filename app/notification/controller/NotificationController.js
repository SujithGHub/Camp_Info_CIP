(function() {
	'use strict';
	/**
	 * @author Ashokrajan
	 */
	angular
	.module('cip.notification')
	.controller('NotificationController', NotificationController);

	NotificationController.$inject = ['$log', 'NotificationService', 'AttendanceCorrectionService', 'CommonService', '$mdDialog', '$scope','SharedService','$rootScope','StandardService','SectionService','DepartmentService','$state','$timeout'];

	/* @ngInject */
	function NotificationController($log, notificationService, attendanceCorrectionService, commonService, $mdDialog, $scope,sharedService,$rootScope,standardService,sectionService,departmentService,$state,$timeout) {
		var vm = this;
		vm.init = init;

		$scope.updateOrDeleteNotification = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};

		vm.broadCastNotificationInit = function() {
			vm.instituteType = sharedService.institute.instituteType;
			if(vm.instituteType == 'School'){
        		getActiveYearAndStandard();
        	}
        	if(vm.instituteType == 'College'){
        		getDepartmentList();
        	}
		}

		function getActiveYearAndStandard() {
			standardService.getActiveStandard(successCb, errorCb);
			function successCb(result) {
				vm.standardList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getActiveYearAndStandard:",error)
			}
		};

		vm.getSectionByStandard = function(form){
			if(form.departmentId && vm.instituteType == 'College') {
				sectionService.getCorrespondingAndIsRestrictSections({classYearId: form.classYearId, departmentId: form.departmentId}, successCb, errorCb);
				function successCb(result) {
					vm.sectionList = result;
				}
				function errorCb(error) {
					$log.debug("FAILURE getSectionByStandard:",error)
				}
			} 
			else if(!form.department && vm.instituteType == 'School') {
				sectionService.getSectionByStandardId({id: form.classYearId},successCb, errorCb);
				function successCb(result) {
					vm.sectionList = result.entityList;
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
			}
			function errorCb(error) {
				$log.debug("FAILURE getDeptByClassName:",error)
			}
		};


		vm.broadCastNotification = function(formData) {
			if(formData.classYearId && formData.departmentId && formData.sectionId && formData.broadcastType == 'choose') {
				formData.broadcastType = "classAndSectionByCollege";
			}else if(formData.classYearId && formData.departmentId && !formData.sectionId && formData.broadcastType == 'choose') {
				formData.broadcastType = "classYearAndDept";
			}else if(formData.classYearId && !formData.departmentId && !formData.sectionId && formData.broadcastType == 'choose') {
				formData.broadcastType = "classYear";
			}else if(formData.classYearId && !formData.departmentId && formData.sectionId && formData.broadcastType == 'choose') {
				formData.broadcastType = "classAndSectionBySchool";
			}else if(!formData.classYearId && formData.departmentId && !formData.sectionId && formData.broadcastType == 'choose') {
    			formData.broadcastType = "department";
    		}else if(formData.broadcastType == 'all'){
				formData.broadcastType = "all";
			}
			notificationService.saveNotification(formData, successCb, errorCb);
			function successCb(result){
				$state.reload();
				vm.getDashboardNotification();
				$log.debug("SUCCESS saveNotification:",result)
			}
			function errorCb(error){
				$log.debug("FAILURE saveNotification:",error)
			}
		}

		vm.deleteNotification = function(data){
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				notificationService.deleteNotificationc(data, successCb, errorCb);
				function successCb(result){
					init();
					vm.getDashboardNotification();
				}
				function errorCb(error){
					$log.debug("FAILURE deleteNotification:",error)
				}
			});
		}

		function getValue(type) {
			var data ={};
			var table = $('#notificationDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			if(type == "update") {
				vm.initData = data;
				$scope.$broadcast('modelForm');
			}
			else if(type=="view"){
				data.viewTitle = true;
				vm.viewNotification(data);
			}
			else 
				vm.deleteNotification(data);
		}

		function init() {
			vm.role = sharedService.userDetails.roles[0].name;
			notificationService.initTable('notificationDataTable')
			$(".content").mCustomScrollbar({theme:"dark-3", axis:"y"});
		};

		vm.saveOrUpdateNotification = function(data) {
			if(data.id)
				notificationService.updateNotification(data, successCb, errorCb);
			else
				notificationService.saveNotification(data, successCb, errorCb);
			function successCb(result){
				init();
				vm.getDashboardNotification();
			}
			function errorCb(error){
				$log.debug("FAILURE saveOrUpdateNotification:",error)
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

		vm.viewNotification = function(data) {
			$mdDialog.show({
				controller: NotificationController,
				controllerAs: 'notificationCtrl',
				templateUrl: '/app/notification/views/viewNotification.html',
				parent: angular.element(document.body),
				bindToController: true,
				locals: {
					scopeValue : data
				},
				clickOutsideToClose:false
			})
		};

		vm.cancel = function() {
			$mdDialog.cancel();
		}

		vm.elapsedTime = function(notificationDate) {
			var notificationUpdatedDate = new Date(notificationDate);
			var notificationTime = notificationUpdatedDate.getTime();
			var now = new Date();
			var currentTime = now.getTime();
			var millis = currentTime - notificationTime;
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

		vm.acceptAttendanceCorrectionRequest = function(data) {
			data.status="ACCEPTED";
			data.attendanceDate = commonService.convertDateFormat(data.attendanceDate);
			attendanceCorrectionService.updateAttendanceCorrection(data, successCb, errorCb);
			function successCb(result) {
				vm.getDashboardNotification();
			}
			function errorCb(error) {
				$log.debug("FAILURE UpdateAttendanceCorrection:",error)
			}
		};
		
		vm.rejectAttendanceCorrectionRequest = function(data){
			data.status="REJECT";
			data.attendanceDate = commonService.convertDateFormat(data.attendanceDate);
			attendanceCorrectionService.updateAttendanceCorrection(data, successCb, errorCb);
			function successCb(result) {
				vm.getDashboardNotification();
			}
			function errorCb(error) {
				$log.debug("FAILURE RejectAttendanceCorrectionRequest:",error)
			}
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