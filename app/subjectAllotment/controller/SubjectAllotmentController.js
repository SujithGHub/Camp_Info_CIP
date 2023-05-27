(function() {
	'use strict';
	/**
	 * @author Deepa
	 */
	angular
	.module('cip.subjectAllotment')
	.controller('SubjectAllotmentController', SubjectAllotmentController);

	SubjectAllotmentController.$inject = ['$log','AcademicService', 'StandardService', 'SubjectService', '$mdDialog', '$http', 'SharedService', 'DepartmentService', 'SectionService', 'SubjectAllotmentService', 'CommonService', 'SystemService'];

	/* @ngInject */
	function SubjectAllotmentController($log, academicService, standardService, subjectService, $mdDialog, $http, sharedService, departmentService, sectionService, subjectAllotmentService, commonService, systemService) {

		var vm = this;
		vm.init		=	init;
		vm.institute    = sharedService.institute;
		vm.instituteType = vm.institute.instituteType;
		var userDetails = sharedService.userDetails;
		vm.role = userDetails.roles[0].name;

		vm.getClassByDepartmentId = getClassByDepartmentId;
		vm.getSection = getSection;
		vm.getSubjects = getSubjects;
		vm.getSemesterByClassYear = getSemesterByClassYear;
		vm.baseApi = commonService.baseApi;

		function init() {
			if(vm.instituteType == "College") {
				if(vm.role == "ROLE_STAFF_HOD") {
                    getActiveHodDepartment();
				}
				getDepartmentList();
			}else {
				getStandardList();
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

		function getSection(id){
			sectionService.getSectionByStandardId({id}, successCb, errorCb);
			function successCb(result){
				vm.sectionList = result.entityList;
			}
			function errorCb(error){
				$log.debug("FAILURE:",error);
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

		function getSubjectAllotmentByClass(classId,sectionId) {
			vm.subjectAllotmentList = [];
			$http.get( commonService.baseApi+'/subjectallotment/school?classId='+classId+'&sectionId='+sectionId)
			.success(function (data, status, headers, config) {
				vm.subjectAllotmentList = data;
				$(".card-container").show();
			});
		}

		function getSubjectAllotmentByDepartment(deptId,classId,sectionId,semester) {
			vm.subjectAllotmentList = [];
			$http.get( commonService.baseApi+'/subjectallotment/college?departmentId='+deptId+'&classId='+classId+'&sectionId='+sectionId+'&semester='+semester)
					.success(function (data, status, headers, config) {
						vm.subjectAllotmentList = data;
						$(".card-container").show();
					});
		}
		
		function getSubjects(form) {
			if(vm.instituteType == "College") {
				getSubjectAllotmentByDepartment(vm.form.department, vm.form.classType.id, vm.form.section, vm.form.semester);
			}else {
				getSubjectAllotmentByClass(vm.form.classType.id, vm.form.section);
			}
		}

		vm.allotSubjects = function(form) {

			var subjectAllotment = []; 
			for(var i=0; i<form.length; i++) {
				if(vm.instituteType == 'College') {
					form[i].department = {};
					form[i].department.id = vm.form.department;
					form[i].semester = vm.form.semester;
				}
				form[i].classYear = {};
				form[i].classYear.id = vm.form.classType.id;
				form[i].section = {};
				form[i].section.id = vm.form.section;
				if(form[i].allotedstaff) {
					form[i].staff = {};
					if(form[i].allotedstaff.originalObject)
					    form[i].staff.id = form[i].allotedstaff.originalObject.id;
					subjectAllotment.push(form[i]);
				}
				
				if(form[i].additional) {
					for(var j=0; j<form[i].additional.length; j++) {
						var formData = {};
						if(vm.instituteType == 'College') {
							formData.department = {};
							formData.department.id = vm.form.department;
							formData.semester = vm.form.semester;
						}
						formData.classYear = {};
						formData.classYear.id = vm.form.classType.id;
						formData.section = {};
						formData.section.id = vm.form.section;
						formData.subject = {};
						formData.subject.id = form[i].subject.id;
						if(form[i].subjectElective) {
							formData.subjectElective = form[i].subjectElective;
						}
						formData.staff = {};
						if(form[i].additional[j].allotedstaff) {
							if(form[i].additional[j].allotedstaff.originalObject)
							    formData.staff.id = form[i].additional[j].allotedstaff.originalObject.id;
							subjectAllotment.push(formData);
						}
					}
				}
			}
			
			$http.post( commonService.baseApi+'/subjectallotment',subjectAllotment)
			.success(function (data, status, headers, config) {
				getSubjects();
			});
		};

		vm.addSubject = function(form,index) {
			if(!vm.subjectAllotmentList[index].additional) {
				vm.subjectAllotmentList[index].additional = [];
			}
			vm.subjectAllotmentList[index].additional.push({});
		};

		vm.removeSubject = function(parentIndex,index) {
			vm.subjectAllotmentList[parentIndex].additional.splice(index, 1);
		};

		vm.removeSubjectAllotment = function(id) {
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');
			$mdDialog.show(confirm).then(function() {
				subjectAllotmentService.deleteSubjectAllotment(id, successCb, errorCb);
				function successCb(result){
					getSubjects();
					$log.debug("SUCCESS deleteSubjectAllotment:",result);
				}
				function errorCb(error){
					$log.debug("FAILURE deleteSubjectAllotment:",error);
				}
			});
		};

	}
})();