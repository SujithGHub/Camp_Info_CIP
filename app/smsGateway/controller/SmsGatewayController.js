(function() {
	'use strict';
	/**
	 * @author Gunasekaran
	 */
	angular
	.module('cip.smsGateway')
	.controller('SmsGatewayController', SmsGatewayController);

	SmsGatewayController.$inject = ['$log', '$scope', '$mdDialog','SmsGatewayService', 'InstituteService','$http','ngTableParams', 'CommonService'];

	/* @ngInject */
	function SmsGatewayController($log, $scope, $mdDialog, SmsGatewayService, instituteService,$http,ngTableParams, commonService) {
		var vm = this;

		vm.init 						= init;
		vm.mScope 						= {};
		vm.saveOrUpdateSmsGateway		= saveOrUpdateSmsGateway;
		vm.mScope.getInstituteList		= getInstituteList;
		vm.mScope.getInstitute			= getInstitute;
		vm.mScope.getInstituteSmsStatisticsReport = getInstituteSmsStatisticsReport;

        function init() {
			getInstitute();
			SmsGatewayService.initTable('smsGatewayDataTable');
		};

		function saveSmsGateway(form) {
			SmsGatewayService.saveSmsGateway(form, successCb, errorCb);
			function successCb(result) {
				init();
				$log.debug("SUCCESS saveSMSGateway:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE saveSMSGateway:",error)
			}
		}

		function updateSmsGateway(form) {
		
			SmsGatewayService.updateSmsGateway(form, successCb, errorCb);
			function successCb(result) {
				init();
				$log.debug("SUCCESS updateSMSGateway:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE updateSMSGateway:",error)
			}
		}

		function saveOrUpdateSmsGateway(form) {

			if(form.id) {
				updateSmsGateway(form);
			}else{
				saveSmsGateway(form);
			}

		}
		
		$scope.updateOrDeleteSmsGateway = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};

		//Delete SmsGateway
		vm.deleteSmsGateway = function(data) {
			var confirm = $mdDialog.confirm()
			.title('Are you sure want to delete?')
			.textContent('You will not be able to recover information!')
			.ok('yes, Please it!')
			.cancel('Cancel');

			$mdDialog.show(confirm).then(function() {
				SmsGatewayService.deleteSmsGateway(data, successCb, errorCb);
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
			var table = $('#smsGatewayDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents());
				$(this).removeClass('selected');
                $scope.instituteDetail = data;

			});
			if(type === "update") {
				vm.initData = data;
                $("#create-smsgateway").click();
			} else if(type === "sms-report") {
                vm.mScope.smsStaticsReport =[];
                $("#smsgateway-statistics-report").click();
			} else {
                vm.deleteSmsGateway(data);
            }
		}
		
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

        function getInstituteSmsStatisticsReport() {
            vm.mScope.smsStaticsReport = [];
            SmsGatewayService.getInstituteSmsStatisticsReport({"instituteId":$scope.instituteDetail.institute.id,"fromDate":commonService.convertDateFormat(vm.mScope.mForm.fromDate),"toDate":commonService.convertDateFormat(vm.mScope.mForm.toDate)},successCb, errorCb);
            function successCb(result) {
            	vm.mScope.smsStaticsReport = result;
                $log.debug("SUCCESS getInstituteSmsStatisticsReport:",result)
            }
            function errorCb(error) {
                $log.debug("FAILURE getInstituteSmsStatisticsReport:",error)
            }
		}

		//Converting util date to js date format
        vm.mScope.getDateFormat = function(timestamp) {
            return new Date(timestamp);
        }

	}
})();