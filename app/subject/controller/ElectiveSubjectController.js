(function() {
	'use strict';
	/**
	 * @author Gunasekaran
	 */
	angular
	.module('cip.subject')
	.controller('ElectiveSubjectController', ElectiveSubjectController);

	ElectiveSubjectController.$inject = ['$log', '$mdDialog', 'SubjectService', '$scope', 'CommonService', 'SharedService', 'ngTableParams'];

	/* @ngInject */
	function ElectiveSubjectController($log, $mdDialog, subjectService, $scope, commonService, sharedService, ngTableParams) {

		var vm = this;

		vm.init = init;
		vm.initDataTable = initDataTable;
		vm.mScope = {};
		vm.role = sessionStorage.getItem('role');
		vm.saveElectiveSubject = saveElectiveSubject;
		vm.updateElectiveSubject = updateElectiveSubject;

		function init() {
			initDataTable();
			vm.mScope.instituteType = sharedService.institute.instituteType;
		}

		function initDataTable() {
			vm.subjectName = sharedService.subjectDetails.subjectName;
			vm.semester = sharedService.subjectDetails.semester;
			var subjectElectives = sharedService.subjectDetails.subjectElectives;
			$scope.subjectElectiveList = subjectElectives;
			$scope.tableData = new ngTableParams({
				page: 1,            // show first page
				count: 10           // count per page
			}, {
				total: subjectElectives.length, // length of data
				getData: function ($defer, params) {
					$defer.resolve(subjectElectives.slice((params.page() - 1) * params.count(), params.page() * params.count()));
				}
			});
		}

		vm.editElectivesubject = function(data) {
			vm.initData = data;
			$scope.$broadcast('modelForm');
		};

		vm.saveOrUpdateElectiveSubject = function(data) {
			if(data.id) {
				updateElectiveSubject(data);
			} else {
				saveElectiveSubject(data);
			}
		};

		function saveElectiveSubject (data) {
			var subject  = sharedService.subjectDetails;
			if(!subject.subjectElectives && !subject.subjectElectives.length) {
				subject.subjectElectives = [];
			}
			if (vm.mScope.instituteType == "School") {
				delete subject.department;
				delete subject.subjectElectives;
			}
			data.subject =  {id:sharedService.subjectDetails.id};
			subject.subjectElectives.push(data);
			
			subjectService.updateSubject(subject, successCb, errorCb);
			function successCb(result) {
				subjectService.getElectiveSubjectBySubjectId({id:subject.id}, successCb, errorCb);
				function successCb(result){
					subject.subjectElectives = result;
					initDataTable();
				}
				function errorCb(error){
					$log.debug("FAILURE getElectiveSubject:",error);
				}
			}
			function errorCb(error) {
				$log.debug("FAILURE saveOrUpdateElectiveSubject:",error);
			}
		}
		
		function updateElectiveSubject (data) {
			var subject  = sharedService.subjectDetails;
			if(!subject.subjectElectives && !subject.subjectElectives.length) {
				subject.subjectElectives = [];
			}
			if (vm.mScope.instituteType == "School") {
				delete subject.department;
			}
			for(var i=0; i<subject.subjectElectives.length; i++) {
				if(subject.subjectElectives[i].id == data.id) {
					subject.subjectElectives[i].electiveSubjectName = data.electiveSubjectName;
					subject.subjectElectives[i].electiveSubjectCode = data.electiveSubjectCode;
					subject.subjectElectives[i].electiveDisplayName = data.electiveDisplayName;
				}
			}
			subjectService.updateSubject(subject, successCb, errorCb);
			function successCb(result) {
				initDataTable();
			}
			function errorCb(error) {
				$log.debug("FAILURE saveOrUpdateElectiveSubject:",error);
			}
		}

		vm.deleteElectivesubject = function(data){
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				var subject  = sharedService.subjectDetails;
				if (vm.mScope.instituteType == "School") {
					delete subject.department;
				}
				
				for(var i=0; i<subject.subjectElectives.length; i++) {
					if(subject.subjectElectives[i].id == data.id) {
						subject.subjectElectives[i].isDeleted = true;
					}
				}
				subjectService.updateSubject(subject, successCb, errorCb);
				function successCb(result){
					subjectService.getElectiveSubjectBySubjectId({id:subject.id}, successCb, errorCb);
					function successCb(result){
						subject.subjectElectives = result;
						initDataTable();
					}
					function errorCb(error){
						$log.debug("FAILURE getElectiveSubject:",error);
					}
				}
				function errorCb(error){
					$log.debug("FAILURE deleteElectiveSubject:",error);
				}
			});
		};

	}
})();