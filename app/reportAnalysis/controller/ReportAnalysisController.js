(function() {
	'use strict';
	/**
	 * @author Deepa
	 */
	angular
	.module('cip.reportAnalysis')
	.controller('ReportAnalysisController', ReportAnalysisController);

	ReportAnalysisController.$inject = ['$http','$log','$scope','SharedService','AcademicService'];

	/* @ngInject */
	function  ReportAnalysisController($http,$log,$scope,sharedService,academicService) {

		var vm = this;

		var userDetails = sharedService.userDetails;
		vm.institute    = sharedService.institute;
		vm.instituteType =sessionStorage.getItem('instituteType');
		vm.getReport    = getReport;
		vm.role = sessionStorage.getItem('role');
		vm.init 				= init();

		var academic_id;
		var academic_year;
		var hour_count;
		var start_date;
		var roll_no;
		var section_id;
		var student_id;
		academicService.getCurrentAcademicYear(successCb,errorCb);
		function successCb(result) {
			academic_id = result.entity.id;
			academic_year = result.entity.academicYear;
			start_date = result.entity.fromDate;
			var today = new Date(start_date);
			start_date = today.getFullYear() + '-' +  ('0' + (today.getMonth()+1)).slice(-2) +  '-' +  ('0' + today.getDate()).slice(-2);
			$log.debug("SUCCESS getCurrentAcademicYear:",result)
		}
		function errorCb(error){
			$log.debug("FAILURE getCurrentAcademicYear:",error)
		}

		 function getTodayDate()  {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1;
			var yyyy = today.getFullYear();
			vm.todayDate = yyyy+ '-' + ('0' + (mm)).slice(-2)+ '-' + ('0' + dd).slice(-2);
		}

		function init() {
			getTodayDate();
			vm.report_status= [{
				"name": "From_Date",
				"value": vm.todayDate,
			}, {
				"name": "To_Date",
				"value": vm.todayDate
			}]
		   }
		
		function getHourCount(){

			vm.hourCount;
			if(vm.institute.attendanceType == 'session') {
				vm.hourCount = 2;
				vm.attendanceLabel = 'SESSIONS'
			}else if(vm.institute.attendanceType == 'day') {
				vm.hourCount = 1;
				vm.attendanceLabel = 'DAYS'
			} else if(vm.institute.attendanceType == 'hours'){
				vm.hourCount = vm.institute.hoursCount;
				vm.attendanceLabel = 'HOURS'
			}
			return vm.hourCount;
		}

		function getReport(reportPath){
			hour_count = getHourCount();
			var attendance_type = vm.attendanceLabel;
			var inputControl = true;
			if(vm.institute.instituteType == 'School') {
				if(reportPath == 'IndividualSection') {
					inputControl = true;
					reportPath = '/examinationReport/IndividualSectionBySchool'
				}else if(reportPath == 'SectionWiseComparative') {
					inputControl = true;
					reportPath = '/examinationReport/SectionWiseComparativeBySchool'
				}else if(reportPath == 'ExamWiseComparative') {
					inputControl = true;
					reportPath = '/examinationReport/ExamWiseComparativeBySchool'	
				}else if(reportPath == 'ViewAttendance') {
					inputControl = false;
					reportPath = '/viewAttendance/ViewAttendanceByStandard'	
				}else if(reportPath == 'AttendanceReport') {
					inputControl = false;
					if(vm.role == 'ROLE_USER') {
						student_id = userDetails.Student.id;
						section_id = userDetails.Student.section.id;
						reportPath = '/attendanceReport/AttendanceReportByStudent'	
					}else {
						reportPath = '/attendanceReport/AttendanceReportByStandard'
					}

				}else if(reportPath == 'AttendanceAnalysis') {
					inputControl = true;
					if(vm.role == 'ROLE_USER') {
						roll_no = userDetails.Student.rollNumber;
						reportPath = '/attendanceAnalysis/AttendanceAnalysisByStudent'	
					}else {
						reportPath = '/attendanceAnalysis/AttendanceAnalysisBySchool'		
					}	
				}else if(reportPath == 'SubjectWiseAttendance') {
					if(vm.role == 'ROLE_USER') {
						inputControl = false;
						student_id = userDetails.Student.id;
						reportPath = '/SubjectWiseAttendanceReport/SubjectWiseAttendanceByStudentForSchool'	
					}else {
						inputControl = true;
						reportPath = '/SubjectWiseAttendanceReport/SubjectWiseAttendanceByAdminForSchool'	
					}
				}
			}else if(vm.institute.instituteType == 'College') {
				if(reportPath == 'IndividualSection') {
					inputControl = true;
					reportPath = '/examinationReport/IndividualSectionByCollege'
				}else if(reportPath == 'SectionWiseComparative') {
					inputControl = true;
					reportPath = '/examinationReport/SectionWiseComparativeByCollege'
				}else if(reportPath == 'ExamWiseComparative') {
					inputControl = true;
					reportPath = '/examinationReport/ExamWiseComparativeByCollege'	
				}else if(reportPath == 'ViewAttendance') {
					inputControl = false;
					reportPath = '/viewAttendance/ViewAttendanceByDepartment'	
				}else if(reportPath == 'AttendanceReport') {
					inputControl = false;
					if(vm.role == 'ROLE_USER') {
						student_id = userDetails.Student.id;
						section_id = userDetails.Student.section.id;
						reportPath = '/attendanceReport/AttendanceReportByStudent'	
					}else {
						reportPath = '/attendanceReport/AttendanceReportByDepartment'	
					}
				}else if(reportPath == 'AttendanceAnalysis') {
					inputControl = true;
					if(vm.role == 'ROLE_USER') {
						roll_no = userDetails.Student.rollNumber;
						reportPath = '/attendanceAnalysis/AttendanceAnalysisByStudent'	
					}else {
						reportPath = '/attendanceAnalysis/AttendanceAnalysisByCollege'	
					}	
				}else if(reportPath == 'SubjectWiseAttendance') {
					inputControl = true;
					if(vm.role == 'ROLE_USER') {
						student_id = userDetails.Student.id;
						reportPath = '/SubjectWiseAttendanceReport/SubjectWiseAttendanceByStudentForCollege'	
					}else {
						reportPath = '/SubjectWiseAttendanceReport/SubjectWiseAttendanceByAdminForCollege'	
					}
				}else if(reportPath == 'HoursWiseAttendance') {
					inputControl = true;
					reportPath = '/hoursWiseAttendanceReport/HoursWiseAttendanceReportByAdminForCollege'	
				}else if(reportPath == 'WorkPlanReportByStaff') {
					inputControl = true;
					reportPath = '/WorkPlanReport/WorkPlanReportByStaff'	
				}else if(reportPath == 'WorkPlanReportBySection') {
					inputControl = true;
					reportPath = '/WorkPlanReport/WorkPlanReportBySection'	
				}
			}

			var tenant_id = vm.institute.id;
			$scope.user = "User";
			if($('#reportModel').length){
				$( "#reportModel" ).detach();
			} 

			var reportView="<div class='modal fade' id='reportModel' tabindex='-1' " +
			"role='dialog' aria-labelledby='myModalLabel' aria-hidden='true' style='padding-right:0px'>" +
			"<div class='modal-dialog' style='width: 100%; height: 99%; margin: 0px; padding: 10px;overflow: hidden;'>" +
			"<div class='modal-content' style='height: 100%;border: none;'><button class='close' data-dismiss='modal'  style='padding-right: 10px;' data-target='#reportModel'>&times;</button>" +
			"<div id='loading' class='text-center full-height' " +
			"style='display: flex; align-items: center; justify-content: center;'>" +
			"<img style='height:85px;' src='assets/images/default.svg'>" +
			"</div>" +
			"<iframe id='reportViewer' style='width: 100%; height: 100%; border: none; border-radius: 8px; margin-top:-21px;'" +
			"src='/jsreports/flow.html?_flowId=viewReportFlow&ParentFolderUri=/CampInfo/Report&tenant_id="+tenant_id+
			"&academic_id="+academic_id+"&academic_year="+academic_year+"&hour_count="+hour_count+"&attendance_type="+attendance_type+
			"&start_date="+start_date+"&roll_no="+roll_no+"&student_id="+student_id+"&section_id="+section_id+"&reportUnit=/CampInfo/Report" +
			reportPath+
			"&sessionDecorator=no&j_username=jasperadmin&j_password=jasperadmin&User_Name="+$scope.user+"'>" +
			"</iframe></div></div>";
			var viewModal=angular.element(reportView)
			$("#reportHolder").html(reportView)

			$('#reportModel').modal('show');

			$("#reportViewer").ready(function () {

				$("#loading").show();
				$("#reportViewer").height(0)
			});

			$("#reportViewer").load(function () {
				//$("#reportViewer").contents().find('#banner').detach();

				$("#reportViewer").contents().find('#fileOptions').detach();
				$("#reportViewer").contents().find('#undo').detach();
				$("#reportViewer").contents().find('#redo').detach();
				$("#reportViewer").contents().find('#undoAll').detach();
				$("#reportMenu").show();
				$("#reportMenu").appendTo($("#reportViewer").contents().find('#viewerToolbar > ul > li:nth-child(2) > ul > li:nth-child(3)'))
				$("#reportViewer").contents().find('#reportSearch').detach();
				$("#reportViewer").contents().find('#reportZoom').detach();
				$scope.reportTitle=$("#reportViewer").contents().find('#reportViewFrame>.content>.header>.title').text();
				$("#reportViewer").contents().find("#reportViewFrame .content>.body").css('top','0px');
				$("#reportViewer").contents().find('#reportViewFrame>.content>.header>.title').detach();
				$("#reportViewer").contents().find('#dataTimestampMessage').appendTo($("#reportViewer").contents().find('#viewerToolbar'));
				$("#reportViewer").contents().find('#dataTimestampMessage').css('margin-top','6px')
				$("#reportViewer").contents().find('#dataRefreshButton').appendTo($("#reportViewer").contents().find('#viewerToolbar'));
				$("#reportViewer").contents().find('#dataRefreshButton').css('margin-top','0px');

				if(inputControl) {
					$("#reportViewer").contents().find('#reportViewFrame').css('left','214px');
				}

				$("#reportViewer").contents().find('.column.decorated').css({'border':'none','margin': '0px'});
				$("#reportViewer").contents().find('#inputControlsForm').css({'width' : '220px', 'min-width': '220px','border-right': '1px solid #D4D5D5'})
				$("#reportViewer").contents().find('.column.decorated>.content>.header').css({'background': '#dededc'});
				$("#reportViewer").contents().find('#viewerToolbar').css({'border-top': 'none'});                     
				$("#loading").hide();
				$("#reportViewer").css('height','100%');       
			});

		}

	}
})();