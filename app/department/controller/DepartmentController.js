(function() {
    'use strict';
    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.department')
        .controller('DepartmentController', DepartmentController);

    DepartmentController.$inject = ['$log', '$scope', '$mdDialog', 'DepartmentService', 'CommonService'];

    /* @ngInject */
    function DepartmentController($log, $scope, $mdDialog, departmentService, commonService) {
        var vm = this;

        vm.init 					= init;
        vm.mScope 					= {};
        vm.saveOrUpdateDepartment 	= saveOrUpdateDepartment;
        
        function saveOrUpdateDepartment(formData) {
        	
        	formData.name 			= formData.name.toUpperCase();
    		formData.displayName 	= formData.displayName.toUpperCase();
        	if(formData.id) {
        		departmentService.updateDepartment(formData, successCb, errorCb);
        	} else {
        		departmentService.saveDepartment(formData, successCb, errorCb);
        	}
        	function successCb(result) {
        		init();
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE saveOrUpdateDepartment:",error)
        	}
        	
        };
        
        $scope.updateDepartment = function() {
			setTimeout(function(){ getValue(); }, 0);
		};
		
		//Get edit and delete data from datatable
		function getValue() {
			var data ={};
			var table = $('#departmentDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents());
				$(this).removeClass('selected');
			});
			vm.initData = data;
			commonService.triggerModelForm();
		}

        function init() {
        	departmentService.initTable('departmentDataTable');
        }

    }
})();