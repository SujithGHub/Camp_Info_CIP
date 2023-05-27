(function() {
	'use strict';
	/**
	 * @author Ashokrajan
	 */
	angular
	.module('cip.subject')
	.controller('SubjectController', SubjectController);

	SubjectController.$inject = ['$log', 'StandardService', 'SubjectService', '$mdDialog', '$scope', 'SharedService', 'DepartmentService', '$state', 'CommonService'];

	/* @ngInject */
	function SubjectController($log, standardService, subjectService, $mdDialog, $scope, sharedService, departmentService, $state, commonService) {
		var vm = this;
		
		vm.mScope = [];
		vm.init		=	init;
		vm.mScope.yearAndStandardList = {};
		vm.mScope.getClassByDepartmentId = getClassByDepartmentId;

		function init() {
			vm.mScope.instituteType = sharedService.institute.instituteType;
			if(vm.mScope.instituteType == 'College')
				getActiveDepartmentList();
			else
				getActiveYearAndStandard();
			initDataTable();
		};

		function initDataTable() {
			subjectService.initTable('subjectDataTable');
		}
		//Save and update subject
		vm.SaveOrUpdateSubject = function(data) {
			if (vm.mScope.instituteType == "School") {
				delete data.department;
                delete data.subjectElectives;
			}
			if(data.id) {
				subjectService.updateSubject(data, successCb, errorCb);
			} else {
				subjectService.saveSubject(data, successCb, errorCb);
			}
        	function successCb(result) {
        		initDataTable();
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE saveOrUpdateSubject:",error)
        	}
		};
		
		$scope.updateOrDeleteSubject = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};

		//Delete subject via popup confirm
		vm.deleteSubject = function(data){
			   var confirm = $mdDialog.confirm()
 	          .title('Are you sure want to delete?')
 	          .textContent('You will not be able to recover information!')
 	          .ok('yes, Please it!')
 	          .cancel('Cancel');

			   $mdDialog.show(confirm).then(function() {
				   if (vm.mScope.instituteType == "School") {
						delete data.department;
					}
				   subjectService.deleteSubject(data, successCb, errorCb);
					function successCb(result){
						initDataTable();
					}
					function errorCb(error){
						$log.debug("FAILURE deleteSubject:",error)
					}
				 });
		}

		function getValue(type) {
			var data ={};
			var table = $('#subjectDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			if(type == "update") {
				vm.initData = data;
				vm.mScope.semestersLists = commonService.getSemesterByClassYear(data.classYear.name);
				$scope.$broadcast('modelForm');
			}
			else if(type == "delete") {
				vm.deleteSubject(data);
			}
			else {
				sharedService.setSubjectDetails(data);
				$state.go('electiveSubject');
			}
		};

		//Get standard list if institute type as school
		function getActiveYearAndStandard() {
			standardService.getActiveStandard(successCb, errorCb);
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
		
		vm.mScope.removeRow = function(index) {
			vm.mScope.mForm.subjectElectives.splice(index, 1);
		}
	}
})();