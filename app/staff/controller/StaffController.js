(function() {
    'use strict';
    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.staff')
        .controller('StaffController', StaffController);

    StaffController.$inject = ['$log', 'StaffService','SharedService', 'CommonService', 'DepartmentService','RoleService', '$mdDialog', '$scope','SystemService'];

    /* @ngInject */
    function StaffController($log, staffService, sharedService, commonService, departmentService, roleService, $mdDialog, $scope,systemService) {
        var vm = this;

        vm.init = init;
        vm.mScope = [];
        
        // Get active department list if institute type as college
		function getActiveDepartmentList() {
        	departmentService.getActiveDepartment(successCb, errorCb);
        	function successCb(result) {
        		vm.mScope.departmentList = result.entityList;
        		vm.mScope.semesterList = result.entity;
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE getActiveDepartmentList:",error);
        	}
        }
				
		function getStaffRoles() {
        	roleService.getAllStaffRoles(successCb, errorCb);
        	function successCb(result) {
        		vm.mScope.staffRoleList = result;
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE getStaffRoleList:",error);
        	}
        }
		
        vm.saveOrUpdateStaff = function(data) {
        	data.dateOfJoining = commonService.convertDateFormat(data.dateOfJoining);
        	data.dob = commonService.convertDateFormat(data.dob);
        	//data.bloodGroup = 'O_NEGATIVE';
        	if(data.id) { staffService.updateStaff(data, successCb, errorCb); }
        	else { staffService.saveStaff(data, successCb, errorCb); }
        	function successCb(result) { init(); }
        	function errorCb(error) {
        		$log.debug("FAILURE saveOrUpdateStaff:",error);
        	}
        };
        
        $scope.updateOrDeleteStaff = function(type) {
			setTimeout(function(){ getValue(type); }, 0);
		};

		function getValue(type) {
			var data ={};
			var table = $('#staffDataTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents());
				$(this).removeClass('selected');
			});
			if(type === "update") {
				data.dob = commonService.convertDatePickerFormat(data.dob);
				vm.initData = data;
				$scope.$broadcast('modelForm');
			} 
		}

        function init() {
        	vm.mScope.instituteType = sharedService.institute.instituteType;
        	if(vm.mScope.instituteType === 'College'){
        		getActiveDepartmentList();
        		getStaffRoles();
        	} else {
        		getStaffRoles();
        	}
            getBloodGroup();
        	$(".content").mCustomScrollbar({theme:"dark-3", axis:"y"});
        	staffService.initTable('staffDataTable');
        }

        function getBloodGroup() {
            systemService.getBloodGroup(successCb, errorCb);
            function successCb(result) {
                vm.mScope.bloodGroupList = result;
            }
            function errorCb(error) {
                $log.debug("FAILURE getStaffRoleList:",error);
            }
        }
    }
})();