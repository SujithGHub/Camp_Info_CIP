(function() {
    'use strict';
    /**
     * @author Deepa
     */
    angular
        .module('cip.report')
        .controller('ReportController', ReportController);

    ReportController.$inject = ['$log', '$http','CommonService','$scope','SharedService','$filter','$location','ReportService','AcademicService','ExaminationService','StudentService'];

    /* @ngInject */
    function ReportController($log,$http,commonService,$scope,SharedService,$filter,$location,reportService,academicService,examinationService,studentService) {
       
    	var vm = this;

    	vm.init 				= init;
    	vm.getStudentDetails	= getStudentDetails;
    	vm.getAttendanceAnalysis= getAttendanceAnalysis;
    	vm.hideReportCard 		= hideReportCard;
    	vm.getResults			= getResults;
    	vm.getReportByAcademic  = getReportByAcademic;
    	vm.getData				= getData;

    	var userDetails = SharedService.userDetails;
    	vm.roles = sessionStorage.getItem('role');
    	vm.instituteType = sessionStorage.getItem('instituteType');
    	vm.institute = SharedService.institute;
    	vm.institute.attendanceType = SharedService.institute.attendanceType;
    	var month= ['January','Febrauary','March','April','May','June','July','August','September','October','November','December'];
    	var orderBy = $filter('orderBy');

    	function init() {
    		academicService.getAcademic({}, successCb, errorCb);
    		function successCb(result) {

    			vm.academic = result.entityList;
    			var currentDate = new Date();
    			for(var i=0;i<vm.academic.length;i++){
    				var fromDate = new Date(vm.academic[i].fromDate);
    				var toDate = new Date(vm.academic[i].toDate);
    				if(fromDate <= currentDate && currentDate <= toDate){
    					$scope.academicYear =  vm.academic[i];
    					$scope.form = {};
    					$scope.form.academic =  vm.academic[i];
    					vm.form = {};
    					vm.form.academic = vm.academic[i];
    					if (Object.getOwnPropertyNames(SharedService.academicYear).length > 0) {
    						$scope.academicYear = SharedService.academicYear;
    					}else {
    						$scope.academicYear = vm.academic[i];
    					}
    				}
    			}

    			if(vm.roles == "ROLE_USER") {
    				vm.rollNumber = userDetails.student.rollNumber;
    				getReportByUser();
    			}

    			if(SharedService.stdRollNo != null) {
    				$scope.academicYear = SharedService.academicYear;
    				var form = {};
    				form.academic = {}
    				form.rollNo = SharedService.stdRollNo;
    				form.academic.id = SharedService.academicYear.id;
    				form.academic.fromDate = SharedService.academicYear.fromDate;
    				form.academic.toDate = SharedService.academicYear.toDate;
    				$scope.form.academic = SharedService.academicYear;
    				getStudentDetails(form);
    				SharedService.setStdRollNo(null);
    			}
    		}
    		function errorCb(error) {
    			$log.debug("FAILURE getAcademicList:",error);
    		}
    	}

    	function getAttendanceLabel(){
    		if(vm.institute.attendanceType == 'session') {
    			vm.attendanceLabel = 'Sessions'
    		}else if(vm.institute.attendanceType == 'day') {
    			vm.attendanceLabel = 'Days'
    		}else if(vm.institute.attendanceType == 'hours') {
    			vm.attendanceLabel = 'Hours'
    		}
    	}

    	function getReportByUser(){
    		$('#reportForm').hide();
    		$('#reportTable').show();
    		var form = {};
    		getStudentDetails(form);
    		var statusInfo = [];
    		var fromDate = new Date($scope.academicYear.fromDate);
    		var startDate = (fromDate.getFullYear() + '-' +(fromDate.getMonth() + 1) + '-'+ fromDate.getDate());
    		var toDate = new Date($scope.academicYear.toDate);
    		var endDate = (toDate.getFullYear() + '-' +(toDate.getMonth() + 1) + '-'+ toDate.getDate());
    		statusInfo.push(startDate);
    		statusInfo.push(endDate);
			statusInfo.push(sessionStorage.getItem('section'))
			statusInfo.push(sessionStorage.getItem('classYear'))
    		statusInfo.push(vm.rollNumber);
    		getNumberOfDaysCountByRollNo(statusInfo);
    		getExamByRollNo(vm.rollNumber)
    	}


    	function getNumberOfDaysCountByRollNo(statusInfo) {

    		reportService.getAttendanceCountByRollNo({statusInfo}, successCb, errorCb);
    		function successCb(result) {
    		
    			$log.debug("SUCCESS getAttendanceCountByRollNo",result);
    			getAttendanceLabel();
    			var numberOfDaysCount = result.entityList;
    			vm.workingDays = numberOfDaysCount[0];
    			vm.presentCount = numberOfDaysCount[1];
    			vm.absentCount = vm.workingDays - vm.presentCount;
    			vm.attendancePercentage = numberOfDaysCount[2];

    		}
    		function errorCb(error) {

    			getAttendanceLabel();
    			vm.workingDays = 0
    			vm.presentCount = 0
    			vm.absentCount = 0
    			vm.attendancePercentage = 0
    			$log.debug("FAILURE getAttendanceCountByRollNo:",error);
    		}
    	}

    	function showReportCard() {
    		$('#reportForm').hide();
    		$('#reportTable').show();
    	}

    	function getAllData(examData) {
    		$scope.academicPerformance = [];
    		var examination = {};
    		var id = examData.id;
    		examinationService.getExamPaperById({id}, successCb, errorCb);
    		function successCb(result) {
    			
    			var examPaperList = result.entityList;
    			var predicate = 'date';
    			examPaperList = orderBy(examPaperList,predicate,false);
    			var date = new Date(examPaperList[0].date);
    			var examDate = date.getMonth();
    			examination.date = date;
    			$http.get( commonService.baseApi+'/result/exam/rollno?examId='+examData.id+'&rollNo='+$scope.rollNo)
    			.success(function(data, status, headers, config){
    				var avgMark = data.entityList[0].avgMark;
    				examination.name = examData.examName;
    				examination.percentage = avgMark;
    				$scope.academicPerformance.push(examination);
    				vm.sortedAcademicPerformance = orderBy($scope.academicPerformance,predicate,false);
    				$(".academicDiv").mCustomScrollbar({theme:"dark-3", axis:"y"});
    			});
    		}
    		function errorCb(error) {
    			$log.debug("FAILURE getAttendanceCountByRollNo:",error);
    		}
    	}

    	function getExamByRollNo(rollNo){
    		$scope.rollNo = rollNo;
    		var academicId = $scope.form.academic.id;

    		reportService.getExamsByRollNoAndAcademicYear({rollNo,academicId}, successCb, errorCb);
    		function successCb(result) {
    			
    			var examList = result.entityList;
    			if(examList.length) {
    				for(var i=0;i<examList.length;i++){
    					getAllData(examList[i]);
    				}
    			}else {
    				vm.sortedAcademicPerformance = []
    			}
    		}

    		function errorCb(error) {
    			$log.debug("FAILURE getExamsByRollNoAndAcademicYear:",error);
    		}
    	}

    	function getDetailsByStudent(formData){
    		if( vm.student != undefined ){
    			$scope.form.academic = formData.academic;
    			getExamByRollNo(formData.rollNo);
    			var statusInfo = [];
    			var fromDate = new Date(formData.academic.fromDate);
    			var startDate = (fromDate.getFullYear() + '-' +(fromDate.getMonth() + 1) + '-'+ fromDate.getDate());
    			var toDate = new Date(formData.academic.toDate);
    			var endDate = (toDate.getFullYear() + '-' +(toDate.getMonth() + 1) + '-'+ toDate.getDate());
    			statusInfo.push(startDate);
    			statusInfo.push(endDate);
				statusInfo.push(vm.student.classYear.id)
				statusInfo.push(vm.student.section.id)
    			statusInfo.push(formData.rollNo);
    			getNumberOfDaysCountByRollNo(statusInfo);
    			showReportCard();
    		}
    	}


    	function getStudent(formData){

    		var rollNo = formData.rollNo;
    		studentService.getStudentByRollNumber({rollNo}, successCb, errorCb);
    		function successCb(result) {
    			vm.student = result.entity;
    			SharedService.setStudentDetails(result.entity);
    			if(vm.roles != "ROLE_USER"){
    				getDetailsByStudent(formData);
    			}
    		}
    		function errorCb(error) {
    			$log.debug("FAILURE getStudentByRollNumber:",error);
    		}
    	}

    	function getStudentDetails(formData) {
    		if(vm.roles == "ROLE_USER"){
    			vm.rollNumber = userDetails.student.rollNumber;
    			formData.rollNo = vm.rollNumber;
    			$scope.rollNo = formData.rollNo;
    		}
    		getStudent(formData);
    	}

    	function getAttendanceAnalysis(){
    		SharedService.setStdRollNo($scope.rollNo);
    		SharedService.setReportStatus(1);
    		if(vm.roles != "ROLE_USER"){
    			SharedService.setAcademicYear($scope.form.academic);
    		}else {
    			SharedService.setAcademicYear($scope.academicYear);
    		}
    		$location.path('attendanceanalysis');
    	}

    	function hideReportCard() {
    		$scope.academicPerformance = [];
    		$('#reportTable').hide();
    		$('#reportForm').show();
    	}

    	function getResults(){
    		SharedService.setStdRollNo($scope.rollNo);
    		SharedService.setReportStatus(1);
    		if(vm.roles != "ROLE_USER"){
    			SharedService.setAcademicYear($scope.form.academic);
    		}else {
    			SharedService.setAcademicYear($scope.academicYear);
    		}
    		$location.path('result');
    	}

    	function getReportByAcademic(academic){
    		$scope.academicYear = academic;
    		$scope.form.academic = academic;
    		SharedService.setAcademicYear(academic);
    		var statusInfo = [];
    		var fromDate = new Date(academic.fromDate);
    		var startDate = (fromDate.getFullYear() + '-' +(fromDate.getMonth() + 1) + '-'+ fromDate.getDate());
    		var toDate = new Date(academic.toDate);
    		var endDate = (toDate.getFullYear() + '-' +(toDate.getMonth() + 1) + '-'+ toDate.getDate());
    		statusInfo.push(startDate);
    		statusInfo.push(endDate);
    		statusInfo.push(vm.rollNumber);
    		getExamByRollNo(vm.rollNumber)
    		getNumberOfDaysCountByRollNo(statusInfo);

    	}
    	

    	function getData(documentType) {
    		$('#htmlContent').empty();
    		var html = '<div class="card-header">';
    		if(vm.instituteType == 'College' || vm.roles == 'ROLE_SUPER_ADMIN'){
    			html += '<h5>Department : <small>'+vm.student.department.name+'</small></h5>'+
    			'<h5>Year : <small>'+vm.student.classYear.name+'</small></h5>'+
    			'<h5>Section : <small>'+vm.student.section.sectionName+'</small></h5>'+
    			'<h5>Roll Number : <small>'+vm.student.rollNumber+'</small></h5>'+
    			'<h5>Student Name : <small>'+vm.student.firstName+' '+vm.student.lastName+'</small></h5>';
    		}
    		else {
    			html += '<h5>Standard : <small>'+vm.student.classYear.name+'</small></h5>'+
    			'<h5>Section : <small>'+vm.student.section.sectionName+'</small></h5>'+
    			'<h5>Roll Number : <small>'+vm.student.rollNumber+'</small></h5>'+
    			'<h5>Student Name : <small>'+vm.student.firstName+' '+vm.student.lastName+'</small></h5>';
    		}
    		html += '<h2>Attendance Report</h2>'+
    		'<table><tbody><tr><td>Total Number of Working Days</td>'+
    		'<td>'+vm.workingDays+'</td></tr><tr><td>Number Of Days Present</td><td>'+
    		vm.presentCount+'</td></tr><tr><td>Number Of Days Absent</td><td>'+
    		vm.absentCount+'</td></tr><tr><td>Over All Percentage</td><td>'+
    		vm.attendancePercentage+'</td></tr></tbody></table>'+
    		'<h2>Academic Report</h2><table><tbody><tr><td>Month</td><td>Exam</td><td>Percentage</td></tr>';

    		for(var i=0;i<vm.sortedAcademicPerformance.length;i++){
    			var examDate = new Date(vm.sortedAcademicPerformance[i].date);
    			var examMonth = examDate.getMonth();
    			html += '<tr><td>'+month[examMonth]+'</td>'+
    			'<td>'+vm.sortedAcademicPerformance[i].name+'</td>'+
    			'<td>'+vm.sortedAcademicPerformance[i].percentage+'</td></tr>';
    		}
    		html += '</tbody></table>'
    			$('#htmlContent').append(html);
    		if(documentType == 'pdf'){
    			$('#htmlContent').show();
    			getDocument();
    			$('#htmlContent').hide();
    		}
    		else {
    			$('#htmlContent').show();
    			$('#pdfBody').tableExport({type:'excel',escape:false,fileName:'Report'});
    			$('#htmlContent').hide();
    			$location.path('/report');
    		}
    	}
    	/*
    	 * Generate Pdf document
    	 */
    	function getDocument() {
    		var pdf = new jsPDF('p', 'pt', 'letter')
    		var source = $('#htmlContent')[0]
    		var margins = {
    			top: 20,
    			bottom: 20,
    			left: 40,
    			width: 522
    		};
    		pdf.fromHTML(
    				source,
    				margins.left,
    				margins.top,
    				{
    					'width': margins.width 
    				},
    				function (dispose) {
    					pdf.save('Report.pdf');
    				},
    				margins
    		)
    		$location.path('/report');
    	}

    }
})();