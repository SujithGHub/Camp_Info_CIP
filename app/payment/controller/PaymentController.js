
(function() {
	'use strict';
	/**
	 * @author Ashokrajan
	 */
	angular
	.module('cip.payment')
	.controller('PaymentController', PaymentController);

	PaymentController.$inject = ['$log', 'PaymentService', 'SharedService', '$mdDialog', '$location', 'CommonService', '$scope', '$state', 'FeesStructureService', 'DepartmentService', 'StandardService', 'FileDownloadService', '$http'];

	/* @ngInject */
	function PaymentController($log, paymentService, sharedService, $mdDialog, $location,commonService, $scope, $state, feesStructureService, departmentService, standardService, fileDownloadService, $http) {
		var vm = this;

		vm.init = init;
		vm.initPayment = initPayment;
		vm.payment = sharedService.payment;
		var userDetails = sharedService.userDetails;
		vm.roles = sessionStorage.getItem('role');
		vm.instituteType = sharedService.institute.instituteType;
		vm.initStudentFeesStructureTable = initStudentFeesStructureTable;
		var dateSearch = false;
		var url;
		var formattedDate;
		vm.showPayment = false;
		vm.openNav  = openNav;
		vm.closeNav = closeNav;
		vm.getClassByDepartmentId = getClassByDepartmentId;
		vm.getPaymentByDepartmentAndClassYear = getPaymentByDepartmentAndClassYear;
		vm.fileExportAndImport = fileExportAndImport;
		if(Object.getOwnPropertyNames(vm.payment).length > 0){
			vm.instituteDetails = sharedService.institute;
			$('#paymentCard').hide();
			$('#success').show();
		}
		
		function initPayment(){
			sharedService.payment = {};
			vm.feesStucture =  sharedService.feesStructure;
		}

		function init() {
			if($scope.dateSearch != undefined && $scope.dateSearch != '') {
				$scope.getPaymentByDate();
			}else {
				getPayment();
			}
			if(vm.instituteType == 'College') {
				getActiveDepartmentList();
			}else{
				getActiveStandard();
			}
			

		};
		
		function openNav() {
			if(vm.roles=='ROLE_ADMIN'){
				document.getElementById("mySidenav").style.width = "240px";
			    document.getElementById("main").style.marginLeft = "250px";
			}
			
		};

		function closeNav() {
			if(vm.roles=='ROLE_ADMIN'){
				 document.getElementById("mySidenav").style.width = "0";
				 document.getElementById("main").style.marginLeft= "0";
			}

		};
	   
		function getPayment() {
			formattedDate = '';
			if(sharedService.userDetails.roles[0].name=='ROLE_ADMIN') 
				url = "/payment";
			else
				url = "/payment/user";
			paymentService.initTable('paymentDataTable', {},url,formattedDate);
		}

		$scope.$watch('dateSearch', function() {
			if($scope.dateSearch != undefined && $scope.dateSearch != '') {
				$scope.getPaymentByDate();
			}else {
				getPayment();
			}

		});

		$scope.getPaymentByDate = function() {
			formattedDate =	commonService.convertDateFormat($scope.dateSearch);
			dateSearch = true;
			if(sharedService.userDetails.roles[0].name=='ROLE_ADMIN') 
				url =  "payment/date";
			else
				url = "payment/user/date";
			paymentService.initTable('paymentDataTable', {},url,formattedDate);
		}

		function getPaymentByDate() {
			console.log(vm.dateSearch)
		}
		
		vm.savePayment = function(data) {
			//data.amount = vm.feesStucture;
			$scope.formData = {};
			if(vm.form != undefined){
				$scope.formData = angular.copy(vm.form);
			}
			if(userDetails.student && userDetails.student.emailId){
				data.email = userDetails.student.emailId;
				save(data);
			}else{
				 $mdDialog.show({
					 controller: PaymentController,
					// controllerAs: 'paymentCtrl',
					 templateUrl: '/app/payment/views/emailForPayment.html',
					 parent: angular.element(document.body),
					 bindToController: true,
					 locals: {
						 scopeValue : data
					 },
					 scope: $scope,
					 preserveScope: true,
					 clickOutsideToClose:false
				 })
			}
		}

		vm.confirmEmail = function() {
			var data = {};

			if($scope.paymentData){
				data = $scope.paymentData;
				data.email = vm.mForm.email;
			}else{
				data = $scope.formData;
				data.email = vm.mForm.email;
			}
			save(data);
		}
		
		function save(data) {
			data.mobileApi = false;
			paymentService.savePayment(data, successCb, errorCb);
			function successCb(result) {
				vm.gatewayObject = result.entity;
				vm.gatewayObject.surl = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port: '') +vm.gatewayObject.surl;
				vm.gatewayObject.furl = window.location.protocol+'//'+window.location.hostname+(window.location.port ? ':'+window.location.port: '') +vm.gatewayObject.furl;
				vm.gatewayObject.amount = parseFloat( vm.gatewayObject.amount); 
				vm.gatewayObject.amount = vm.gatewayObject.amount.toFixed(2);
				$mdDialog.show({
					controller: function ($mdDialog) {
						var vm = this;
						vm.cancel= function () {
							$mdDialog.hide();
						};
						vm.paymentConfirm = function () {
							$('#paymentForm').submit();
						}
					},
					controllerAs: 'paymentCtrl',
					templateUrl: '/app/payment/views/paymentConfirm.html', 
					parent: angular.element(document.body),
					clickOutsideToClose: false
				});
				$log.debug("SUCCESS savePayment:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE savePayment:",error)
			}
		}
		
		var status = $location.search().status;
		if(status == 'error'){
			$log.debug("payment failure")
		}
		else if(status == 'success'){
			var paymentId = $location.search().id;
			paymentService.getPaymentById({id : paymentId}, successCb, errorCb);
			function successCb(result) {
				vm.payment = result.entity;
				vm.instituteDetails = sharedService.institute;
				$('#paymentCard').hide();
				$('#success').show();
				$log.debug("SUCCESS getPaymentById:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE getPaymentById:",error)
			}
		};

		$scope.viewReceipt = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};

		function getValue(type) {
			var data ={};
			var table = $('#paymentDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			sharedService.setPayment(data);
			$state.go('payFees')
		};
		
		function initStudentFeesStructureTable(){
			feesStructureService.initStudentFeesStructureTable('studentFeesStructureDataTable');
		}
		
		$scope.payFees = function(type) {
			setTimeout(function(){ getFeesValue(type); }, 0);
		};
		
		function getFeesValue(type) {
			var data ={};
			var table = $('#studentFeesStructureDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
			});
			sharedService.setFeesStructure(data);
			var paymentData = {};
			paymentData.amount = data.fee;
			paymentData.productinfo = data.name;
			paymentData.feesStructure = data;
			$scope.paymentData = paymentData;
			vm.savePayment(paymentData)
			//$state.go('payFees')
		};
		
		//Get active department list if institute type as college
		function getActiveDepartmentList() {
			departmentService.getActiveDepartment(successCb, errorCb);
			function successCb(result) {
				vm.departmentList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getActiveDepartmentList:",error)
			}
		};
		
		// Get active class year list by deparment id
		function getClassByDepartmentId(id) {
			standardService.getClassByDepartmentId({id}, successCb, errorCb);
			function successCb(result) {
				vm.yearAndStandardList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getClassByDepartmentId:",error)
			}
		};
		
		function getPaymentByDepartmentAndClassYear(formData) {
			formData.fromDate =	commonService.convertDateFormat(formData.fromDate);
			formData.toDate =	commonService.convertDateFormat(formData.toDate);
		    url = "payment/department/classyear";
			paymentService.initPaymentByFilterTable('paymentDataTable', {},url,formData);
		}
		
		// Get active standard list if institute type as school
		function getActiveStandard() {
			standardService.getActiveStandard(successCb, errorCb);
			function successCb(result) {
				vm.yearAndStandardList = result.entityList;
				$log.debug("SUCCESS getActiveStandard",result);
			}
			function errorCb(error) {
				$log.debug("FAILURE getActiveStandard:",error)
			}
		};
		
		function fileExportAndImport(data) {
			var result = [];
			result.push(commonService.convertDateFormat(data.fromDate));
			result.push(commonService.convertDateFormat(data.toDate));
			fileDownloadService.downloadPayment(result, vm.instituteType);
		}
		
		 vm.downloadTemplate = function() {
             vm.downloadTemplateDetail = {"name":"Payment"}
             fileDownloadService.downloadTemplate(vm.downloadTemplateDetail);
         }
		 
		 vm.readFile = function(element) {
			 vm.file = {};
			 $scope.$apply(function(scope) {
				 if($(element)[0].target.files.length){
					 angular.forEach(element.target.files, function(value, key) {
						 vm.file = value ;
					 });
					 vm.upload = {fileName : $(element)[0].target.files[0].name, fileLength : $(element)[0].target.files.length};
				 }
			 });
			 
		 };

		 vm.dropFile = function(files) {
			 vm.upload = "";
			 vm.file = {};
			 angular.forEach(files, function(value, key) {
				 vm.file= value;
			 });

			 $scope.$apply(function(scope) {
				 vm.upload = {fileName : files[0].name, fileLength : files.length};
			 });
		 }

		 vm.clearFile = function() {
			 vm.upload = "";
			 $("#upload").val('');
			 vm.file = '';
		 };

		 vm.uploadPayment = function() {
			 var formData = new FormData();
             formData.append('file', vm.file);
             $http({
                 method: 'post',
                 url:  commonService.baseApi+'/payment/upload',
                 headers: {'Content-Type': undefined},
                 data: formData,
                 transformRequest: function(data, headersGetterFunction) {
                     return data; 
                 }
             }).success(function(data, status) {
                 vm.file = {};
                 getPayment();
                 $mdDialog.cancel();
             }).error(function(data, status) {
             });
		 }
		 

		 vm.importAndExport = function(data) {
			 $mdDialog.show({
				 controller: PaymentController,
				 controllerAs: 'paymentCtrl',
				 templateUrl: '/app/payment/views/fileExportAndImport.html',
				 parent: angular.element(document.body),
				 bindToController: true,
				 locals: {
					 scopeValue : data
				 },
				 clickOutsideToClose:false
			 })
		 };

		 vm.cancel = function() {
			 $mdDialog.cancel();
		 }
	}
})();