(function() {
	'use strict';
	/**
	 * @author Deepa
	 */
	angular
	.module('cip.timeTable')
	.controller('TimeTableController', TimeTableController);

	TimeTableController.$inject = ['$log','AcademicService', 'StandardService', 'SubjectService', '$mdDialog', '$http', 'SharedService', 'DepartmentService', 'SectionService', 'TimeTableService', 'CommonService', "SystemService"];

	/* @ngInject */
	function TimeTableController($log, academicService, standardService, subjectService, $mdDialog, $http, sharedService, departmentService, sectionService, timeTableService, commonService, systemService) {

		var vm = this;
		vm.form = {};
		vm.mScope = {};
		vm.initData = {};
		vm.init		=	init;
		vm.institute    = sharedService.institute;
		vm.instituteType = sessionStorage.getItem('instituteType');
		vm.hourCount = vm.institute.hoursCount;
		vm.mScope.hourCount = vm.hourCount;
		var userDetails = sharedService.userDetails;
		vm.role = sessionStorage.getItem('role');

		vm.getClassByDepartmentId = getClassByDepartmentId;
		vm.getSection = getSection;
		vm.getTimeTable = getTimeTable;
		vm.getTimeTableValues = getTimeTableValues;
		vm.getSubjects = getSubjects;
		vm.getSemesterByClassYear = getSemesterByClassYear;
		
		vm.column_width = 'col-md-10';
		vm.saturday = false;

		var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

		function init() {
			academicService.getAcademic({}, successCb, errorCb);
			function successCb(result) {

				vm.academic = result.entityList;
				var currentDate = new Date();
				for(var i=0;i<vm.academic.length;i++){
					var fromDate = new Date(vm.academic[i].fromDate);
					var toDate = new Date(vm.academic[i].toDate);
					if(fromDate <= currentDate && currentDate <= toDate){
						vm.form.academic = vm.academic[i].id;
						vm.form.status = "Friday";
					}
				}

			}
			function errorCb(error) {
				$log.debug("FAILURE getAcademicList:",error);
			}

			if(vm.role == 'ROLE_USER') {
				vm.column_width = 'col-md-12 col-sm-12 col-xs-12';
				vm.input_div = false;
				getTimeTableByStudent();
			}else {
				vm.column_width = 'col-lg-10 col-md-9 col-sm-8 col-xs-8 pl-2';
				vm.input_div = true;
				if(vm.instituteType == "College") {
					if(vm.role == "ROLE_STAFF_HOD") {
                        getActiveHodDepartment();
					}
					getDepartmentList();
				}else {
					getStandardList();
				}
			}

			if(vm.role == 'ROLE_STAFF') {
				vm.column_width = 'col-md-12 col-sm-12 col-xs-12';
				vm.input_div = false;
				getTimeTableByStaff();
			}

			
		}
		function getActiveHodDepartment() {
            if (vm.role == "ROLE_STAFF_HOD") {
                systemService.getUser(successCb, errorCb);
                function successCb(result) {
                    vm.form = {};
                    vm.form.department = result.entity.staff.department.id;
                    getClassByDepartmentId(vm.form.department);
                }
                function errorCb(error) {
                    $log.debug("FAILURE getUser:",error)
                }
            }
        }

		function getTimeTableByStudent() {
			timeTableService.getTimeTable({}, successCb, errorCb);
			function successCb(result) {
				vm.tForm = [];
				if(result.entityList.length === 0) {
					$("#no-record").html("<br><br><br><br><center><h3>No Record Found</h3></center>");
					$("#no-record").show();
				}else {
					vm.tForm = result.entityList;
					if(result.entityList.length == 6) {
						vm.saturday = true;
					}
					$(".card-container").show();
					$("#no-record").hide();
				}
				$log.debug("SUCCESS getTimeTable",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getTimeTable:",error);
			}
		}

		// Get standard list if institute type is school
		function getStandardList() {
			standardService.getActiveStandard(successCb, errorCb);
			function successCb(result) {
				vm.classList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getActiveYearAndStandard:",error);
			}
		}

		// Get active department list if institute type is college
		function getDepartmentList() {
			departmentService.getActiveDepartment(successCb, errorCb);
			function successCb(result) {
				vm.departmentList = result.entityList;
				vm.semesterList = result.entity;
			}
			function errorCb(error) {
				$log.debug("FAILURE getActiveDepartmentList:",error);
			}
		}

		// Get active class list by department id
		function getClassByDepartmentId(id) {
			standardService.getClassByDepartmentId({id}, successCb, errorCb);
			function successCb(result) {
				vm.classList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getClassByDepartmentId:",error);
			}
		}
		
		function getSemesterByClassYear(id){
			for(var i=0; i<vm.classList.length;i++){
				if(vm.classList[i].id==id){
					vm.semestersLists=commonService.getSemesterByClassYear(vm.classList[i].name);
					i+=vm.classList.length-i;
				}
			}
		};

		function getSection(id){
			sectionService.getSectionByStandardId({id:id}, successCb, errorCb);
			function successCb(result){
				vm.sectionList = result.entityList;
			}
			function errorCb(error){
				$log.debug("FAILURE:",error);
			}
		}

		function getSubjectBySemesterId(deptId,semester) {
			subjectService.getSubjectBySemesterId({deptId, semester}, successCb, errorCb);
			function successCb(result) {
				vm.subjectList = result.entityList;
				vm.mScope.subjectList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getSubjectBySemesterId:",error);
			}
		}

		function getSubjectByClassId(id) {
			subjectService.getSubjectByClassId({id}, successCb, errorCb);
			function successCb(result) {
				vm.subjectList = result.entityList;
				vm.mScope.subjectList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getSubjectBySectionId:",error);
			}
		}

		function getTimeTableByDepartment(academicId,deptId,classId,sectionId,semester) {
			$http.get( commonService.baseApi+'/timetable/department?academicId='+academicId+'&departmentId='+deptId+'&classId='+classId+'&sectionId='+sectionId+'&semester='+semester)
			.success(function (data) {
				vm.tForm = [];
				if(data.entityList.length === 0) {
					vm.btnText = 'Save';
					for(var i = 0;i<5;i++) {
						vm.tForm[i] = {};
						vm.tForm[i].day = days[i];
					}

				}else {
					vm.btnText = 'Update';
					vm.tForm = data.entityList;
				}

			});
		}

		function getTimeTableByClass(academicId,classId,sectionId) {
			$http.get( commonService.baseApi+'/timetable/class?academicId='+academicId+'&classId='+classId+'&sectionId='+sectionId)
			.success(function (data) {
				vm.tForm = [];
				if(data.entityList.length === 0) {
					vm.btnText = 'Save';
					for(var i = 0;i<5;i++) {
						vm.tForm[i] = {};
						vm.tForm[i].day = days[i];
					}
				}else {
					vm.btnText = 'Update';
					vm.tForm = data.entityList;
				}

			});
		}

		function getUpdatedTimeTable() {

			if(vm.instituteType == "College") {
				getTimeTableByDepartment(vm.form.academic, vm.form.department, vm.form.classType.id, vm.form.section, vm.form.semester);
			}else {
				getTimeTableByClass(vm.form.academic, vm.form.classType.id, vm.form.section);
			}
			$(".card-container").show();

		}

		function getTimeTable(form) {
			getUpdatedTimeTable();
			if(vm.instituteType == "College") {
				getSubjectBySemesterId(form.department,form.semester);
			}else {
				getSubjectByClassId(form.classType.id);
			}
		}


		function getTimeTableValues(form) {

			var academic = {};
			academic.id = vm.form.academic;
			var department = {};
			department.id = vm.form.department;
			var classYear = {};
			classYear.id =  vm.form.classType.id;
			var section = {};
			section.id = vm.form.section;

			for(var i = 0;i<vm.tForm.length;i++) {
				vm.tForm[i].displayOrder = i+1;
				vm.tForm[i].academic = academic;
				if(vm.instituteType == "College") {
					vm.tForm[i].semester = vm.form.semester;
					vm.tForm[i].department = department;
				}
				vm.tForm[i].classYear = classYear;
				vm.tForm[i].section = section;
				vm.tForm[i].day = days[i];
			}


			if(vm.tForm[0].id) {
				$http.post( commonService.baseApi+'/timetable/update', vm.tForm)
				.success(function (data) {
					getUpdatedTimeTable();
				});
			}else {
				$http.post( commonService.baseApi+'/timetable/save', vm.tForm)
				.success(function (data) {
					getUpdatedTimeTable();
				});
			}
		}

		function getSubjects(data) {
			for(var i = 0;i<6;i++) {
				if(days[i] == vm.day) {
					vm.tForm[i] = vm.mScope.mForm;
				}
			}
		}
		
		function getTimeTableByStaff() {
			timeTableService.getTimeTableByStaff({}, successCb, errorCb);
			function successCb(result) {
				vm.staffTimeTable = [];
				vm.staffTimeTable= result.entity;
				
				var width =  (100 - 20) / vm.hourCount;
				vm.withInPercentage = width +"%";
				
				
				$log.debug("SUCCESS getTimeTable",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getTimeTable:",error);
			}
		}

	}
})();