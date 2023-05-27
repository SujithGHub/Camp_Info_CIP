(function() {
	'use strict';
	/**
	 * @author Deepa
	 */
	angular
	.module('cip.smtp')
	.controller('SmtpController', SmtpController);

	SmtpController.$inject = ['$log', '$scope', '$mdDialog','SmtpService', 'InstituteService','$http','ngTableParams'];

	/* @ngInject */
	function SmtpController($log, $scope, $mdDialog, smtpService, instituteService,$http,ngTableParams) {
		var vm = this;

		vm.init 						= init;
		vm.mScope 						= {};
		vm.saveOrUpdateSMTP				= saveOrUpdateSMTP;
		vm.mScope.getInstituteList		= getInstituteList;
		vm.mScope.getInstitute			= getInstitute;

		function init() {
			getInstitute();
			smtpService.initTable('smtpDataTable');
		};

		function saveSMTP(form) {
			smtpService.saveSmtp(form, successCb, errorCb);
			function successCb(result) {
				init();
			}
			function errorCb(error) {
				$log.debug("FAILURE saveSMTP:",error)
			}
		}

		function updateSMTP(form) {
		
			smtpService.updateSmtp(form, successCb, errorCb);
			function successCb(result) {
				init();
			}
			function errorCb(error) {
				$log.debug("FAILURE updateSMTP:",error)
			}
		}

		function saveOrUpdateSMTP(form) {

			form.tenantId = form.institute;
			if(form.id) {
				updateSMTP(form);
			}else{
				saveSMTP(form);
			}

		}
		
		$scope.updateOrDeleteSmtp = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};
		
		//Delete academic
		vm.deleteSmtp = function(data) {
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				smtpService.deleteSmtp(data, successCb, errorCb);
				function successCb(result) {
					init();
					$log.debug("SUCCESS deleteInstitute:",result)
				}
				function errorCb(error ){
					$log.debug("FAILURE deleteInstitute:",error)
				}
			});
		};

		//Get edit and delete data from datatable
		function getValue(type) {
			var data ={};
			var table = $('#smtpDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			if(type == "update") {
				vm.initData = data;
				$scope.$broadcast('modelForm');
			}
			else
				vm.deleteSmtp(data);
		};
		
		function getInstituteList(searchText) {
			instituteService.getInstituteListByInstituteName({searchValue : searchText}, successCb, errorCb);
			function successCb(result) {
				vm.mScope.instituteList = result.entityList;
				$log.debug("SUCCESS getInstituteList:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE getInstituteList:",error)
			}
		}

		function getInstitute() {
			instituteService.getInstituteList(successCb, errorCb);
			function successCb(result) {
				vm.mScope.instituteList = result.entityList;
				$log.debug("SUCCESS getInstituteList:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE getInstituteList:",error)
			}
		}

	}
	
})();