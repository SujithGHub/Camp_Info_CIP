(function() {
	'use strict';
	/**
	 * @author Ashokrajan
	 */
	angular
	.module('cip.examination')
	.controller('ExaminationController', ExaminationController);

	ExaminationController.$inject = ['$log', '$state', 'ExaminationService', '$mdDialog', '$scope', 'CommonService', 'StandardService', 'SharedService', 'DepartmentService', 'SectionService', 'SubjectService', 'SystemService'];

	/* @ngInject */
	function ExaminationController($log, $state, examinationService, $mdDialog, $scope, commonService, standardService, sharedService, departmentService, sectionService, subjectService, systemService) {
		var vm = this;

		vm.init = init;
		vm.initDataTable = initDataTable; 
		vm.mScope = [];
		vm.mScope.getClassByDepartmentId = getClassByDepartmentId;
		vm.mScope.getSubjectBySemesterId = getSubjectBySemesterId;
		vm.mScope.getActiveHodDepartment = getActiveHodDepartment;
		vm.mScope.getSubjectByClassId = getSubjectByClassId;
		vm.mScope.getClassYearsByDepartmentAndStaff = getClassYearsByDepartmentAndStaff;
		vm.role = sessionStorage.getItem('role');

		vm.saveOrUpdateExam = function(data) {
			data.examPapers = [];
			for (var i in data.examPaper) {
				if(data.examPaper[i].subject) {
					data.examPaper[i].date=commonService.convertDateFormat(data.examPaper[i].date);
					data.examPapers.push(data.examPaper[i]);
				} else {
					data.examPaper.splice(i);
				}
			}
			if(data.id) {
				examinationService.updateExamination(data, successCb, errorCb);
			}
			else {
				examinationService.saveExamination(data, successCb, errorCb);
			}
			function successCb(result) {
				initDataTable();
			}
			function errorCb(error) {
				$log.debug("FAILURE saveOrUpdateExam:",error)
			};
		}

		$scope.updateOrDeleteExamination = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};

		function getValue(type) {
			var data ={};
			var table = $('#examinationDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			if(type == "update") {
				if(vm.mScope.instituteType == 'College') {
					getClassByDepartmentId(data.department.id);
					vm.mScope.semestersLists = commonService.getSemesterByClassYear(data.classYear.name);
					vm.mScope.getSectionByStandardId(data.classYear.id, data.department.id);
				} else {
					vm.mScope.getSectionByStandardId(data.classYear.id);
				}
				
				vm.initData = data;
				$scope.$broadcast('examModelForm');
			}
			else{
				sharedService.setExamDetails(data);
				$state.go('exampaper');
			}
		}

		function getYearAndStandard() {
			standardService.getClassYearByRole(successCb, errorCb);

			function successCb(result) {
				vm.mScope.yearAndStandardList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getActiveYearAndStandard:",error)
			}
		};

		//Get active department list if institute type as college
		function getActiveDepartmentList() {
			departmentService.getActiveDepartment(successCb, errorCb);
			function successCb(result) {
				vm.mScope.departmentList = result.entityList;
				vm.mScope.semesterList = result.entity;
			}
			function errorCb(error) {
				$log.debug("FAILURE getActiveDepartmentList:",error)
			}
		};

		// Get active class year list by deparment id
		function getClassByDepartmentId(id) {
			standardService.getClassByDepartmentId({id}, successCb, errorCb);
			function successCb(result) {
				vm.mScope.yearAndStandardList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getClassByDepartmentId:",error)
			}
		};

		// Get semester by class year 
		vm.mScope.getSemesterByClassYear=function(id){
			for(var i=0; i<vm.mScope.yearAndStandardList.length;i++){
				if(vm.mScope.yearAndStandardList[i].id==id){
					vm.mScope.semestersLists=commonService.getSemesterByClassYear(vm.mScope.yearAndStandardList[i].name);
					i+=vm.mScope.yearAndStandardList.length-i;
				}
			}
		};		

		// Get section list by class year id, department id role based
		vm.mScope.getSectionByStandardId = function(classYearId, departmentId) {
			sectionService.getSectionByDepartmentAndClassAndRole({classYearId,departmentId},successCb, errorCb);
			function successCb(result) {
				vm.mScope.sectionList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getSectionById:",error);
			}
		};


		function getSubjectBySemesterId(deptId,semester) {
			subjectService.getSubjectBySemesterId({deptId, semester}, successCb, errorCb);
			function successCb(result) {
				vm.mScope.subjectList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getSubjectBySemesterId:",error)
			}
		};

		function getSubjectByClassId(id) {
			subjectService.getSubjectByClassId({id}, successCb, errorCb);
			function successCb(result) {
				vm.mScope.subjectList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getSubjectBySectionId:",error)
			}
		};

		vm.mScope.removeRow = function(index) {
			vm.mScope.examPapers.splice(index, 1);
		}

		function getActiveHodDepartment() {
			if(vm.role == "ROLE_STAFF_HOD"){ 
				systemService.getUser(successCb, errorCb);
				function successCb(result) {
					vm.initData = {};
					vm.initData.department = result.entity.staff.department;
					vm.initData.status = 'Active';
					getClassByDepartmentId(result.entity.staff.department.id);
				}
				function errorCb(error) {
					$log.debug("FAILURE getUser:",error)
				}
			}
		}

	
		function init() {
			initDataTable();
			vm.mScope.instituteType = sharedService.institute.instituteType;
			if(vm.mScope.instituteType === 'College') {
        vm.mScope.role = sharedService.userDetails.roles[0].name;
        //getActiveHodDepartment();
        getDepartmentByRole();
				/*if(vm.role == "ROLE_STAFF_HOD"){
					vm.mScope.role = sharedService.userDetails.roles[0].name;
					getActiveHodDepartment();
				} else if(vm.role === "ROLE_STAFF") {

				}
				getActiveDepartmentList();*/
			}
			else {
				getYearAndStandard();
			}
		}

    //Get active department list if institute type as college
    function getDepartmentByRole() {
      departmentService.getDepartmentByRole(successCb, errorCb);
      function successCb(result) {
        vm.mScope.departmentList = result.entityList;
        //vm.mScope.semesterList = result.entity;
      }
      function errorCb(error) {
        $log.debug("FAILURE getActiveDepartmentList:",error)
      }
    }

    // Get active class year list by deparment id
    function getClassYearsByDepartmentAndStaff(id) {
      standardService.getClassYearByDepartmentAndRole({id}, successCb, errorCb);
      function successCb(result) {
        vm.mScope.yearAndStandardList = result.entityList;
      }
      function errorCb(error) {
        $log.debug("FAILURE getClassByDepartmentId:",error)
      }
    };

		function initDataTable() {
			examinationService.initTable('examinationDataTable');
		}

	}
})();