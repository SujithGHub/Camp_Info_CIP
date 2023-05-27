(function() {
	'use strict';
	
	
	/**
	 * @author Krishna
	 */
	angular
	.module('cip.attendanceCorrection')
	.controller('AttendanceCorrectionController', AttendanceCorrectionController);

	AttendanceCorrectionController.$inject = ['$log', 'AttendanceCorrectionService', 'NotificationService', 'SharedService', 'CommonService', '$mdDialog', '$scope', '$state', '$rootScope'];

	/* @ngInject */
	function AttendanceCorrectionController($log, attendanceCorrectionService, notificationService, sharedService, commonService, $mdDialog, $scope, $state, $rootScope) {
		var vm = this;
		vm.mScope = {};
		vm.init		=	init;
		function init() {
			vm.mScope.instituteType = sharedService.institute.instituteType;
			vm.role = sharedService.userDetails.roles[0].name;
			initDataTable();
		};

		function initDataTable() {
			attendanceCorrectionService.initTable('attendanceCorrectionDataTable');
		};

		$scope.acceptAttendanceCorrection = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};
		
		vm.updateAttendanceCorrection  = function(data) {
			if(data.id){
				attendanceCorrectionService.updateAttendanceCorrection(data, successCb, errorCb);
				function successCb(result) {
	        		initDataTable();
	        		vm.getDashboardNotification();
	        	}
	        	function errorCb(error) {
	        		$log.debug("FAILURE UpdateAttendanceCorrection:",error)
	        	}
			}
		};
		
		vm.enterAttendace = function (data){
			var studentDetails = {};
			studentDetails.attendanceDate = data.attendanceDate;
			studentDetails.hour = data.hour;
			studentDetails.semester = data.student.semester;
			studentDetails.department = data.student.department.id;
			studentDetails.classYear = data.student.classYear;
			studentDetails.section = data.student.section.id;
			sharedService.setAttendanceCorrectionDetails(studentDetails);
			$state.go('attendance');
		}
		
		vm.updateAttendanceCorrectionRequest = function(data) {
			data.status="ACCEPTED";
			vm.updateAttendanceCorrection(data);
		}
		
		vm.getDashboardNotification = function () {
        	notificationService.getDashboardNotification(successCb, errorCb);
        	function successCb(result){
        		$rootScope.attendanceCorrectionList = result.attendanceCorrection;
        	}
        	function errorCb(error){
        		$log.debug("FAILURE getNotificationList:",error)
        	}
        }
		
		function getValue(type) {
			var data ={};
			var table = $('#attendanceCorrectionDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			if(type == "view") {
				vm.initData = data;
				commonService.triggerModelForm();
			}
			if(type == "ACCEPTED" || type == "REJECT") {
				data.status = type;
				vm.updateAttendanceCorrection(data);
			}
			if(type == "enterAttendance") {
				vm.enterAttendace(data);
			}
			
		};
}
})();