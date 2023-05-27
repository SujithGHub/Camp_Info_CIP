(function () {
    'use strict';
    /**
     * @author Mariselvam
     */
    angular
        .module('cip.feesStructure')
        .controller('FeesStructureController', FeesStructureController);

    FeesStructureController.$inject = ['$log', 'FeesStructureService', 'DepartmentService', 'StandardService', 'AcademicService', 'SharedService', 'CommonService', '$scope', '$mdDialog', 'SystemService', 'SectionService'];

    /* @ngInject */
    function FeesStructureController($log, feesStructureService, departmentService, standardService, academicService, sharedService, commonService, $scope, $mdDialog, systemService, sectionService) {
        var vm = this;

        vm.init = init;
        vm.mScope = [];
        vm.mScope.departmentList = {};
        vm.saveOrUpdateFees = saveOrUpdateFees;
        vm.mScope.getClassByDepartmentId = getClassByDepartmentId;
        vm.getSectionByClassYearId = getSectionByClassYearId;
        vm.initDataTable = initDataTable;

        function init() {
            vm.mScope.instituteType = sharedService.institute.instituteType;
            vm.loggedInUser = sharedService.userDetails.roles ? sharedService.userDetails.roles[0].name : '';
            if (vm.mScope.instituteType === 'College') {
                getActiveDepartmentList();
                getClassYearList();
            } else {
                getActiveStandard();
            }
            initDataTable();
            getPaymentMode();
        }

        function initDataTable() {
            feesStructureService.initTable('feesDataTable');
        }

        function getClassYearList() {
            standardService.getClassYearByConstant(successCb, errorCb);

            function successCb(result) {
                vm.mScope.classYearList = result;
                $log.debug("SUCCESS classYear", result);
            }

            function errorCb(error) {
                $log.debug("FAILURE classYear:", error)
            }
        }

        // Save and update Fees
        function saveOrUpdateFees(data) {
            data.name = data.name.toUpperCase();
            data.date = commonService.convertDateFormat(data.date);
            data.lastDate = commonService.convertDateFormat(data.lastDate);
            data.startDate = commonService.convertDateFormat(data.startDate);
            if (data.id)
                feesStructureService.updateFees(data, successCb, errorCb);
            else
                feesStructureService.saveFees(data, successCb, errorCb);

            function successCb(result) {
                initDataTable();
                $log.debug("SUCCESS saveOrUpdateSection:", result)
            }

            function errorCb(error) {
                $log.debug("FAILURE saveOrUpdateSection:", error)
            }
        }

        $scope.updateOrDeleteFees = function (type) {
            setTimeout(function () {
                getValue(type);
            }, 0);
        };

        vm.deleteFees = function (data) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete?')
                .textContent('You will not be able to recover information!')
                .ok('yes, Please it!')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                feesStructureService.deleteFees(data, successCb, errorCb);

                function successCb(result) {
                    initDataTable();
                    $log.debug("SUCCESS deleteFees:", result)
                }

                function errorCb(error) {
                    $log.debug("FAILURE deleteFees:", error)
                }
            });
        };

        function getValue(type) {
            var data = {};
            var departments = [];
            var table = $('#feesDataTable').dataTable();
            $(".selected", table.fnGetNodes()).each(function () {
                data = table.fnGetData($(this).parents());
                $(this).removeClass('selected');
            });
            if (type === "update") {
                vm.initData = data;
                $scope.$broadcast('modelForm');
            }
            else {
                vm.deleteFees(data);
            }
        }

        //Get active department list if institute type as college
        function getActiveDepartmentList() {
            departmentService.getActiveDepartment(successCb, errorCb);

            function successCb(result) {
                vm.mScope.departmentList = result.entityList;
                $log.debug("SUCCESS getActiveDepartmentList", result);
            }

            function errorCb(error) {
                $log.debug("FAILURE getActiveDepartmentList:", error)
            }
        }

        // Get active standard list if institute type as school
        function getActiveStandard() {
            standardService.getActiveStandard(successCb, errorCb);

            function successCb(result) {
                vm.mScope.yearAndStandardList = result.entityList;
                $log.debug("SUCCESS getActiveStandard", result);
            }

            function errorCb(error) {
                $log.debug("FAILURE getActiveStandard:", error)
            }
        }

        // Get active class year list by deparment id
        function getClassByDepartmentId(id) {
            standardService.getClassByDepartmentId({id}, successCb, errorCb);

            function successCb(result) {
                vm.mScope.yearAndStandardList = result.entityList;
                $log.debug("SUCCESS getClassByDepartmentId", result);
            }

            function errorCb(error) {
                $log.debug("FAILURE getClassByDepartmentId:", error)
            }
        }

        function getSectionByClassYearId(id){
            sectionService.getSectionByStandardId({id}, successCb, errorCb);
            function successCb(result){
                vm.mScope.sections = result.entityList;
            }
            function errorCb(error){
                $log.debug("FAILURE getClassYearByDeptId:",error);
            }
        }

        vm.getFeeModeStudents = function(classYear, section) {
            feesStructureService.getStudentsPaymentMode({classYear: classYear, section:section}, successCb, errorCb);
            function successCb(result){
                vm.selectAllCount = 0;
                vm.selectAll = "";
                vm.studentsPaymentMode = result.entity;
            }
            function errorCb(error){
                $log.debug("FAILURE getClassYearByDeptId:",error);
            }
        };

        vm.updateStudentPaymentMode = function(paymentMode) {
            var selectedStudents = [];
            angular.forEach(vm.studentsPaymentMode, function(student){
                if(student.isSelected) {
                    selectedStudents.push(student);
                }
            });
            feesStructureService.saveStudentsPaymentMode({paymentMode: paymentMode}, selectedStudents, successCb, errorCb);
            function successCb(result){
                vm.getFeeModeStudents(vm.form.classYear.id, vm.form.section.id);
            }
            function errorCb(error){
                $log.debug("FAILURE getClassYearByDeptId:",error);
            }
        };

        vm.selectAllStudent = function(option) {
            vm.selectAllCount = 0;
            if(option === "ALL") {
                vm.selectAllCount = vm.studentsPaymentMode.length;
                angular.forEach(vm.studentsPaymentMode, function(student){ student.isSelected = true; });
            } else if(option === "NONE"){
                angular.forEach(vm.studentsPaymentMode, function(student){ student.isSelected = false; });
            }
        };

        vm.selectStudent = function(index, opertion) {

            if(opertion === "UNSELECT") {
                vm.selectAllCount = vm.selectAllCount - 1;
                vm.selectAll = false;
            } else if(opertion === "SELECT"){
                vm.selectAllCount = vm.selectAllCount + 1;
                if(vm.selectAllCount === vm.studentsPaymentMode.length) {
                    vm.selectAll      = "ALL";
                }
            }
        };

        vm.mScope.selectAllPageStatus = function () {
            vm.mScope.mForm.departments = vm.mScope.departmentList;
        };

        vm.mScope.deselectAllPageStatus = function () {
            vm.mScope.mForm.departments = [];
        };


        function getPaymentMode() {
            systemService.getPaymentMode(successCb, errorCb);

            function successCb(result) {
                vm.mScope.paymentModeList = result;
            }

            function errorCb(error) {
                $log.debug("FAILURE getStaffRoleList:", error);
            }
        }
    }
})();