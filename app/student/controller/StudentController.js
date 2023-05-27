(function () {
    'use strict';
    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.student')
        .controller('StudentController', StudentController);

    StudentController.$inject = ['$log', 'StandardService', 'SubjectService', 'AcademicService', 'StudentService', 'SectionService', 'CommonService', '$mdDialog', '$scope', 'SharedService', 'DepartmentService', 'SystemService'];

    /* @ngInject */
    function StudentController($log, standardService, subjectService, academicService, studentService, sectionService, commonService, $mdDialog, $scope, sharedService, departmentService, systemService) {
        var vm = this;

        vm.init = init;
        vm.mScope = [];
        vm.mScope.getClassByDepartmentId = getClassByDepartmentId;
        vm.initDataTable = initDataTable;
        vm.mScope.controls = [{}];
        vm.mScope.skipIfMax = skipIfMax;

        function init() {
            vm.mScope.instituteType = sessionStorage.getItem('instituteType');
            if (vm.mScope.instituteType === 'College')
                getActiveDepartmentList();
            else
                getYearAndStandard();

            initDataTable();
            getAcademic();
            getBloodGroup();
        }

        function initDataTable() {
            let searchInfo = "";
            if (vm.mScope.instituteType === 'College') {
                searchInfo = vm.studentSearch ? vm.studentSearch.department.id : "";
            } else if (vm.mScope.instituteType === 'School') {
                searchInfo = vm.studentSearch ? vm.studentSearch.classYear.id : "";
            }
            studentService.initTable('studentDataTable', searchInfo);
        }

        function skipIfMax(aadharNumber) {
            if (aadharNumber.length >= 4) {
                if (vm.mScope.mForm.aadharNumberFirst & vm.mScope.mForm.aadharNumberSecond) {
                    document.getElementById("myAadhar3").focus();
                } else {
                    document.getElementById("myAadhar2").focus();
                }
            }
        }

        // Save and update student
        vm.saveOrUpdateStudent = function (data) {
            data.classYear = {id: data.classYear.id};

            if (!vm.mScope.mForm.isDuplicate) {
                data.dateOfJoining = commonService.convertDateFormat(data.dateOfJoining);
                data.dateOfCompletion = commonService.convertDateFormat(data.dateOfCompletion);
                data.dob = commonService.convertDateFormat(data.dob);
                if (data.id) {
                    studentService.updateStudent(data, successCb, errorCb);
                } else {
                    studentService.saveStudent(data, successCb, errorCb);
                }

                function successCb(result) {
                    initDataTable();
                }

                function errorCb(error) {
                    $log.debug("FAILURE saveOrUpdateStudent:", error);
                }
            }
        };

        $scope.updateStudent = function (type) {
            setTimeout(function () {
                getValue(type);
            }, 0);
        };

        function getValue(type) {
            var data = {};
            var table = $('#studentDataTable').dataTable();
            $(".selected", table.fnGetNodes()).each(function () {
                data = table.fnGetData($(this).parents());
                $(this).removeClass('selected');
            });
            if (type == "update") {
                vm.mScope.getSectionByStandardId(data.classYear.id);
                if (data.dateOfJoining !== undefined) {
                    data.dateOfJoining = commonService.convertDatePickerFormat(data.dateOfJoining);
                }
                if (data.dateOfCompletion !== undefined) {
                    data.dateOfCompletion = commonService.convertDatePickerFormat(data.dateOfCompletion);
                }
                if (data.dob !== undefined) {
                    data.dob = commonService.convertDatePickerFormat(data.dob);
                }
                data.sslcMark = parseFloat(data.sslcMark);
                data.hscMark = parseFloat(data.hscMark);
                vm.mScope.getStudentSubjectByClassYearId(data.classYear.id, data.semester, data);
                vm.mScope.semestersLists = commonService.getSemesterByClassYear(data.classYear.name);
                data.iterateSubjectField = data.subject;
                vm.initData = data;
                $scope.$broadcast('modelForm');
            }
        }

        // Get standard list if institute type is school
        function getYearAndStandard() {
            standardService.getActiveStandard(successCb, errorCb);

            function successCb(result) {
                vm.mScope.yearAndStandardList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getActiveYearAndStandard:", error);
            }
        }

        function getAcademic() {
            academicService.getAcademic(successCb, errorCb);

            function successCb(result) {
                vm.mScope.academicList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getAcademic:", error);
            }
        }

        // Get active department list if institute type as college
        function getActiveDepartmentList() {
            departmentService.getActiveDepartment(successCb, errorCb);

            function successCb(result) {
                vm.mScope.departmentList = result.entityList;
                vm.mScope.semesterList = result.entity;
            }

            function errorCb(error) {
                $log.debug("FAILURE getActiveDepartmentList:", error);
            }
        }

        // Get active class year list by deparment id
        function getClassByDepartmentId(id) {
            standardService.getClassByDepartmentId({id}, successCb, errorCb);

            function successCb(result) {
                vm.mScope.yearAndStandardList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getClassByDepartmentId:", error);
            }
        }

        // Get section list by class year id
        vm.mScope.getSectionByStandardId = function (id) {
            sectionService.getSectionByStandardId({id}, successCb, errorCb);

            function successCb(result) {
                vm.mScope.sectionList = result.entityList;
                vm.mScope.controls = [{}];
            }

            function errorCb(error) {
                $log.debug("FAILURE getSectionById:", error);
            }
        };

        // Get semester by class year
        vm.mScope.getSemesterByClassYear = function (id) {
            for (var i = 0; i < vm.mScope.yearAndStandardList.length; i++) {
                if (vm.mScope.yearAndStandardList[i].id == id) {
                    vm.mScope.semestersLists = commonService.getSemesterByClassYear(vm.mScope.yearAndStandardList[i].name);
                    i += vm.mScope.yearAndStandardList.length - i;
                }
            }
        };

        vm.mScope.getStudentSubjectByClassYearId = function (classYear, semester, editData) {
            subjectService.getStudentSubjectByClassYearId({classYear, semester}, successCb, errorCb);

            function successCb(result) {
                vm.mScope.subjectList = result.entityList;
                if (editData && editData.isElective) {
                    if (vm.mScope.subjectList.length == editData.studentsElectiveSubject.length) {
                        vm.mScope.disableAddBtn = true;
                    }
                    for (var i = 0; i < editData.studentsElectiveSubject.length; i++) {
                        vm.mScope.getElectiveSubjectList(editData.studentsElectiveSubject[i].subject.id, i);
                    }
                }
            }

            function errorCb(error) {
                $log.debug("FAILURE getStudentSubjectByClassYearId:", error);
            }
        };

        /** Iterate elective subject list from subjectList by subjectId*/
        vm.mScope.getElectiveSubjectList = function (id, index, modelForm) {
            for (var i = 0; i < vm.mScope.subjectList.length; i++) {
                if (vm.mScope.subjectList[i].id == id) {
                    vm.mScope["electiveSubjectList" + index] = vm.mScope.subjectList[i].subjectElectives;
                    i += vm.mScope.subjectList.length - i;
                }
            }
            if (vm.mScope.mForm.studentsElectiveSubject.length >= 2 && modelForm !== undefined) {
                vm.checkDuplicate(modelForm, vm.mScope.mForm.studentsElectiveSubject);
            }
        };

        //RemoveElective subject
        vm.mScope.removeRow = function (index, modelForm) {
            if (!vm.mScope.mForm.studentsElectiveSubject[index].id) {
                vm.mScope.mForm.studentsElectiveSubject.splice(index, 1);
            } else {
                vm.mScope.mForm.studentsElectiveSubject[index].isDeleted = true;
            }
            vm.mScope.validateAddSubject(modelForm);
        };

        vm.mScope.addRow = function () {
            vm.mScope.mForm.studentsElectiveSubject.push({});
            vm.mScope.validateAddSubject();
        };

        vm.mScope.validateAddSubject = function (modelForm) {
            var subjectList = angular.copy(vm.mScope.mForm.studentsElectiveSubject);
            vm.mScope.mForm.studentsElectiveSubject.map(function (item) {
                if (item.isDeleted || item.subject === undefined) {
                    subjectList.splice(subjectList.indexOf(item), 1);
                }
            });

            if (subjectList.length == vm.mScope.subjectList.length) {
                vm.mScope.disableAddBtn = true;
            } else {
                vm.mScope.disableAddBtn = false;
            }
            if (subjectList.length === 0) {
                return vm.mScope.mForm.studentsElectiveSubject.push({});
            }

            // This condition satisfy when method call from vm.mScope.removeRow()
            if (modelForm !== undefined) {
                vm.checkDuplicate(modelForm, subjectList);
            }
        };

        //Check duplicate elective subject
        vm.checkDuplicate = function (modelForm, subjectList) {
            var valueArr = subjectList.map(function (item, index) {
                if (item.isDeleted) {
                    return index;
                }
                if (item.subject && item.subject.id) {
                    return item.subject.id;
                }
            });
            var isDuplicate = valueArr.some(function (item, idx) {
                return valueArr.indexOf(item) != idx;
            });
            vm.mScope.mForm.isDuplicate = isDuplicate;
            modelForm['subject'].$setValidity('valid-dup', !isDuplicate);
        };

        function getBloodGroup() {
            systemService.getBloodGroup(successCb, errorCb);

            function successCb(result) {
                vm.mScope.bloodGroupList = result;
            }

            function errorCb(error) {
                $log.debug("FAILURE getStaffRoleList:", error);
            }
        }
    }
})();