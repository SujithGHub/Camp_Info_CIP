(function() {
	'use strict';
	/**
	 * @author Ashokrajan
	 */
	angular
	.module('cip.examination')
	.controller('ExampaperController', ExampaperController);

	ExampaperController.$inject = ['$log', '$mdDialog', 'ExaminationService', '$scope', 'CommonService', 'SharedService', 'DepartmentService', 'StandardService', 'SubjectService','ngTableParams'];

	/* @ngInject */
	function ExampaperController($log, $mdDialog, examinationService, $scope, commonService, sharedService, departmentService, standardService, subjectService, ngTableParams) {

		var vm = this;

		vm.init = init;
		vm.initDataTable = initDataTable;
		vm.mScope = {};
		vm.role = sessionStorage.getItem('role');
		vm.mScope.getElectiveSubjectBySubjectId = getElectiveSubjectBySubjectId;

		function init() {
			initDataTable();
			vm.mScope.instituteType = sharedService.institute.instituteType;
			if(vm.mScope.instituteType == 'College') {
				getActiveDepartmentList();
				getSubjectBySemesterId(sharedService.examDetails.department.id,sharedService.examDetails.semester);
			}
			else {
				getYearAndStandard();
				getSubjectByClassId(sharedService.examDetails.classYear.id);
			}
		}

		function initDataTable() {
			vm.examName = sharedService.examDetails.examName;
			vm.semester = sharedService.examDetails.semester;
			var id = sharedService.examDetails.id;
			examinationService.getExamPaperById({id}, successCb, errorCb);
			function successCb(result) {
				$scope.examPaperList = result.entityList;
				$scope.tableData = new ngTableParams({
					page: 1,            // show first page
					count: 10           // count per page
				}, {
					total: result.entityList.length, // length of data
					getData: function ($defer, params) {
						$defer.resolve(result.entityList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
					}
				});
				$log.debug("SUCCESS getExampaper:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE getExampaper:",error)
			}
		}


		vm.editExamPaper = function(data) {
			vm.mScope.getElectiveSubjectBySubjectId(data.subject.id);
			data.date = commonService.convertDatePickerFormat(data.date);
			vm.initData = data;
			$scope.$broadcast('modelForm');
		}

		vm.saveOrUpdateExampaper = function(data) {
			data.examination = {id:sharedService.examDetails.id};
			data.date	=	commonService.convertDateFormat(data.date);
			if(data.subjectElective) {
				if(!data.subjectElective.id && !data.subjectElective.electiveSubjectName) {
					delete data.subjectElective;
				}
			}
			if(data.id) {
				examinationService.updateExampaper(data, successCb, errorCb);
			} else {
				examinationService.saveExampaper(data, successCb, errorCb);
			}
			function successCb(result) {
				initDataTable();
				$log.debug("SUCCESS saveOrUpdateExampaper:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE saveOrUpdateExampaper:",error)
			}
		}

		/*$scope.updateOrDeleteExampaper = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};*/

		vm.deleteExampaper = function(data){
			data.date	=	commonService.convertDateFormat(data.date);
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				if(!data.subjectElective.id) {
					delete data.subjectElective;
				}
				examinationService.deleteExampaper(data, successCb, errorCb);
				function successCb(result){
					init();
					$log.debug("SUCCESS deleteExampaper:",result)
				}
				function errorCb(error){
					$log.debug("FAILURE deleteExampaper:",error)
				}
			});
		}

		function getYearAndStandard() {
			standardService.getActiveStandard(successCb, errorCb);

			function successCb(result) {
				vm.mScope.yearAndStandardList = result.entityList;
				$log.debug("SUCCESS getActiveYearAndStandard:",result);
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
				$log.debug("SUCCESS getActiveDepartmentList",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getActiveDepartmentList:",error)
			}
		};

		function getSubjectByClassId(id) {
			subjectService.getSubjectByClassId({id}, successCb, errorCb);

			function successCb(result) {
				vm.mScope.subjectList = result.entityList;
				$log.debug("SUCCESS getSubjectByClassId",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getSubjectByClassId:",error)
			}
		}

		function getSubjectBySemesterId(deptId,semester) {

			subjectService.getSubjectBySemesterId({deptId, semester}, successCb, errorCb);
			function successCb(result) {
				vm.mScope.subjectList = result.entityList;
				$log.debug("SUCCESS getSubjectBySemesterId",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getSubjectBySemesterId:",error)
			}
		};

		function getElectiveSubjectBySubjectId(id) {
			vm.mScope.subjectElectiveList = [];
			for (var i=0; i < vm.mScope.subjectList.length; i++) {
				if(vm.mScope.subjectList[i].id == id && vm.mScope.subjectList[i].isElective) {
					vm.mScope.subjectElectiveList = vm.mScope.subjectList[i].subjectElectives;
				}
			}
		}

		$scope.checkDate = function (examPaper) {
			var currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0, 0);
			var examDate =  new Date(examPaper.date);
			examDate.setHours(0, 0, 0, 0, 0);
			if(currentDate.getTime() == examDate.getTime()){
				return "font-danger";
			}else if(examDate.getTime() < currentDate.getTime()){
				return "font-danger fade";
			}
		};

	}
})();