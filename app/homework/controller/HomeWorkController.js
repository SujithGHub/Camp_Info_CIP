(function () {
    'use strict';
    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.homeWork',['textAngular'])
        .controller('HomeWorkController', HomeWorkController);

    HomeWorkController.$inject = ['$log', '$rootScope', '$sce', 'StandardService', 'CommonService', 'SectionService', 'SubjectService', 'DepartmentService', 'HomeWorkService', '$mdDialog', '$scope', 'SharedService', '$http', '$compile', '$mdToast', 'SystemService'];

    /* @ngInject */
    function HomeWorkController($log, $rootScope, $sce, standardService, commonService, sectionService, subjectService, departmentService, homeWorkService, $mdDialog, $scope, sharedService, $http, $compile, $mdToast, systemService) {
        var vm = this;

        vm.init = init;
        vm.initDataTable = initDataTable;
        vm.mScope = {};
        vm.getSection = getSection;
        vm.mScope.files = [];
        vm.getHomeWorkImageById = getHomeWorkImageById;
        vm.role = sessionStorage.getItem('role');
        vm.mScope.instituteType =  sessionStorage.getItem('instituteType');
        vm.mScope.ImageList = [];
        vm.mScope.homework = {};
        vm.mScope.submittedHomework = {};

        vm.cancel = function () {
            $mdDialog.cancel();
            $('#editor').empty();
        };

        vm.mScope.cancel = function () {
            $scope.$broadcast('closeModel');
        };


        vm.saveOrUpdateHomeWork = function (data) {
            //data.date						=	commonService.convertDateFormat(data.date);
            data.lastDateOfSubmission = commonService.convertDateFormat(data.lastDateOfSubmission);

            var formData = new FormData();
            if (vm.mScope.files.length > 0) {
                for (var i = 0; i < vm.mScope.files.length; i++) {
                    formData.append("imageList", vm.mScope.files[i]);
                }
            }
            if (vm.mScope.electiveSubjectList.length === 0) {
                delete data.subjectElective;
            }
            if (data.id) {
                if (vm.mScope.instituteType === "School") {
                    delete data.department;
                }
                formData.append("homeWork", JSON.stringify(data));
                saveOrUpdateHomeWork("/homework/update", formData);
            } else {
                formData.append("homeWork", JSON.stringify(data));
                saveOrUpdateHomeWork("/homework", formData);
            }
        };

        function saveOrUpdateHomeWork(url, formData) {
            $http({
                method: 'post',
                url:  commonService.baseApi+url,
                headers: {'Content-Type': undefined},
                data: formData,
                transformRequest: function (data, headersGetterFunction) {
                    return data;
                }
            }).success(function (data, status) {
                vm.cancel();
                initDataTable();
                vm.mScope.files = [];
            });
        }

        $scope.updateOrDeleteHomeWork = function (type) {
            setTimeout(function () {
                getValue(type);
            }, 0);
        };

        function getValue(type) {
            var data = {};
            var table = $('#homeWorkDataTable').dataTable();
            $(".selected", table.fnGetNodes()).each(function () {
                data = table.fnGetData($(this).parents());
                $(this).removeClass('selected');
                vm.initData = data;
            });
            if (vm.role === 'ROLE_USER') {
                if (vm.homeWorkStatus === 'SUBMITTED') {
                    var table = $('#closedHomeWorkDataTable').dataTable();
                    $(".selected", table.fnGetNodes()).each(function () {
                        data = table.fnGetData($(this).parents());
                        $(this).removeClass('selected');
                        vm.initData = data;
                    });
                }
            }
            if (type === "update") {
                //data.date = commonService.convertDatePickerFormat(data.date);
                data.lastDateOfSubmission = commonService.convertDatePickerFormat(data.lastDateOfSubmission);
                if (vm.mScope.instituteType === "College") {
                    vm.mScope.getClassByDepartmentId(data.department.id);
                    vm.mScope.semestersLists = commonService.getSemesterByClassYear(data.classYear.name);
                    vm.mScope.getSubjectBySemesterAndSectionAndStaff(data.subject.semester, data.section.id, data.classYear.id, data.department.id, data.subject.id);
                    data.semester = data.subject.semester;
                    vm.mScope.getSectionById(data.classYear.id, data.department.id);
                    getHomeWorkImageById(data.id);
                } else {
                    vm.mScope.getSubjectBySemesterAndSectionAndStaffSchool(data.classYear.id, data.section.id, data.subject.id);
                    vm.mScope.getSectionById(data.classYear.id);
                    getHomeWorkImageById(data.id);
                }
                vm.mScope.today = Date.now();
                vm.initData = data;
                $scope.$broadcast('modelForm');
            } else if (type === 'view') {
                getSubmittedHomeworkByHomeworkId(data, data.id);
                $("#closed-homework").click();
            }
        }

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        function getSection(){
    		var id = vm.classYear;
            vm.section = ''
    		sectionService.getsectionByClassYearIdIsRestrict({id:id}, successCb, errorCb);
			function successCb(result){
				$log.debug("SUCCESS:",result)
				vm.sectionList = result;
			}
			function errorCb(error){
                $log.debug("FAILURE:",error)
			}
            initDataTable()
    	}

        vm.mScope.getSectionById = function (classYearId, departmentId) {
            sectionService.getSectionByDepartmentAndClassAndRole({classYearId, departmentId}, successCb, errorCb);

            function successCb(result) {
                vm.mScope.sectionList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getSectionById:", error)
            }
        };

        vm.mScope.getSubjectById = function (id, subjectId) {
            subjectService.getSubjectByClassId({id}, successCb, errorCb)

            function successCb(result) {
                vm.mScope.subjectList = result.entityList;
                if (subjectId) {
                    vm.mScope.getElectiveSubject(subjectId);
                }
            }

            function errorCb(error) {
                $log.debug("FAILURE getSubjectById:", error)
            }
        };

        // Get semester by class year
        vm.mScope.getSemesterByClassYear = function (id) {
            for (var i = 0; i < vm.mScope.yearAndStandardList.length; i++) {
                if (vm.mScope.yearAndStandardList[i].id === id) {
                    vm.mScope.semestersLists = commonService.getSemesterByClassYear(vm.mScope.yearAndStandardList[i].name);
                    i += vm.mScope.yearAndStandardList.length - i;
                }
            }
        };

        function getActiveDepartmentList() {
            departmentService.getActiveDepartment(successCb, errorCb);

            function successCb(result) {
                vm.mScope.semesterList = result.entity;
                vm.mScope.departmentList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getActiveDepartmentList:", error)
            }
        }

        function getActiveYearAndStandard() {
            standardService.getActiveStandard(successCb, errorCb);

            function successCb(result) {
                vm.mScope.yearAndStandardList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getActiveYearAndStandard:", error)
            }
        }

        // Get active class year list by deparment id
        vm.mScope.getClassByDepartmentId = function (id) {
            standardService.getClassYearByDepartmentAndRole({id: id}, successCb, errorCb);

            function successCb(result) {
                vm.mScope.yearAndStandardList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getClassByDepartmentId:", error)
            }
        };


        vm.mScope.getSubjectBySemesterAndSectionAndStaff = function (semester, section, classYearId, departmentId, subjectId) {
            var id = classYearId;
            if (vm.role == "ROLE_STAFF_HOD" && $rootScope.userInfo.staff.department.id == departmentId || vm.role == "ROLE_ADMIN") {
                subjectService.getSubjectByClassId({id: id}, successCb, errorCb);
            } else {
                subjectService.getSubjectBySemesterAndSectionAndStaff({semester, section}, successCb, errorCb);
            }

            function successCb(result) {
                vm.mScope.subjectList = result.entityList;
                /** Call getElectiveSubject method when update only */
                if (subjectId) {
                    vm.mScope.getElectiveSubject(subjectId,semester,section);
                }
            }

            function errorCb(error) {
                $log.debug("FAILURE getSubjectBySemesterAndSectionAndStaff:", error)
            }
        };
        vm.mScope.getSubjectBySemesterAndSectionAndStaffSchool = function (classYearId, sectionId, subjectId) {
            var id = classYearId;
            if (vm.role == "ROLE_ADMIN") {
                subjectService.getSubjectByClassId({id: id}, successCb, errorCb);
            } else {
                subjectService.getsubjectByClassYearAndSectionAndStaff({classYearId, sectionId}, successCb, errorCb);
            }

            function successCb(result) {
                vm.mScope.subjectList = result.entityList;
                /** Call getElectiveSubject method when update only */
                if (subjectId) {
                    vm.mScope.getElectiveSubject(subjectId);
                }
            }

            function errorCb(error) {
                $log.debug("FAILURE getSubjectBySemesterAndSectionAndStaff:", error)
            }
        };
        /** Iterate elective subject from subjectlist by subject id */
        vm.mScope.getElectiveSubject = function (id,semester,section) {
        if(vm.role == 'ROLE_STAFF') {
             subjectService.getElectiveSubjectBySubjectId({id,semester,section},successCb,errorCb);
            function successCb(result) {
                vm.mScope.electiveSubjectList = result;
            }

            function errorCb(error) {
                $log.debug("FAILURE getElectiveSubject:", error)
            }
        }else {
            for (var i = 0; i < vm.mScope.subjectList.length; i++) {
                if (vm.mScope.subjectList[i].id === id && vm.mScope.subjectList[i].isElective) {
                    // subjectService.getElectiveSubjectBySubjectId({id,semester,section},successCb,errorCb);
                    vm.mScope.electiveSubjectList = vm.mScope.subjectList[i].subjectElectives;
                    i += vm.mScope.subjectList.length - i;
                } else {
                    vm.mScope.electiveSubjectList = [];
                }
            }
        }
        };

        vm.mScope.removeImage = function (homeWorkPicture, homeWorkId) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete?')
                .textContent('You will not be able to recover information!')
                .ok('yes, Please it!')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                homeWorkService.removeImage(homeWorkPicture, successCb, errorCb);

                function successCb(result) {
                    getHomeWorkImageById(homeWorkId);
                    $log.debug("SUCCESS removeImage:", result)
                }

                function errorCb(error) {
                    $log.debug("FAILURE removeImage:", error)
                }
            });
        };

        vm.mScope.clearFile = function () {
            vm.mScope.upload = "";
            $("#upload").val('');
            vm.mScope.files = [];
        };

        function getHomeWorkImageById(id) {
            homeWorkService.getHomeWorkImageById({id: id}, successCb, errorCb);

            function successCb(result) {
                vm.mScope.ImageList = result.entityList;
                $log.debug("SUCCESS getAlbumById:", result)
            }

            function errorCb(error) {
                $log.debug("FAILURE getAlbumById:", error)
            }
        }

        function init() {
            vm.role = sessionStorage.getItem('role');
            vm.mScope.instituteType = sessionStorage.getItem('instituteType');
            if (vm.mScope.instituteType === "College") {
                getDepartmentByRole();
                getClassYearByRole();
                vm.mScope.pendingHomeWork = "Pending Assignment";
                vm.mScope.closedHomeWork = "Closed Assignment";
            } else {
                // getDepartmentByRole();
                getClassYearByRole();
                vm.mScope.pendingHomeWork = "Pending HomeWork";
                vm.mScope.closedHomeWork = "Closed HomeWork";
            }
            initDataTable();
        }

        vm.mScope.readFile = function (element) {
            vm.mScope.files = [];
            if (fileValidation(element, element.target.files)) {
                $scope.$apply(function (scope) {
                    if ($(element)[0].target.files.length) {
                        angular.forEach(element.target.files, function (value, key) {
                            vm.mScope.files.push(value)
                        });
                        vm.mScope.upload = {
                            fileName: $(element)[0].target.files[0].name,
                            fileLength: $(element)[0].target.files.length
                        };
                        $("#dragAndDropError").remove();
                    }
                });
            }
        };

        vm.mScope.dropFile = function (files) {
            vm.mScope.upload = "";
            vm.mScope.files = [];
            angular.forEach(files, function (value, key) {
                vm.mScope.files.push(value)
            });
            $scope.$apply(function (scope) {
                    vm.mScope.upload = {fileName: files[0].name, fileLength: files.length};
                }
            );
        };

        function initDataTable() {
            if (vm.role === 'ROLE_USER') {
                vm.homeWorkStatus = 'PENDING';
                homeWorkService.initTable('homeWorkDataTable', vm.role, vm.homeWorkStatus);
            } else {
                homeWorkService.initTable('homeWorkDataTable', vm.role, vm.homeWorkStatus, vm.classYear,vm.section);
            }
            $(".dataTables_scrollBody").mCustomScrollbar({theme: "dark-3", axis: "x"});
            
        }

        vm.searchData = function () {
            if (vm.role === 'ROLE_USER') {
                if (vm.homeWorkStatus === 'PENDING') {
                    initDataTable();
                } else {
                    vm.initclosedHomeWorkDataTable();
                }
            } else {
                initDataTable();
            }
        };
        vm.initclosedHomeWorkDataTable = function () {
            vm.homeWorkStatus = 'SUBMITTED';
            homeWorkService.initTable('closedHomeWorkDataTable', vm.role, vm.homeWorkStatus);
            $(".dataTables_scrollBody").mCustomScrollbar({theme: "dark-3", axis: "x"});
        };

        function fileValidation(element, files) {
            var count = 0;
            var filesLength = files.length;
            var acceptFormat = element.target.attributes.accept.value.split(",");
            for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
                for (var index = 0; index < acceptFormat.length; index++) {
                    if (files[fileIndex].type === acceptFormat[index]) {
                        count += 1;
                    }
                }
            }
            if (count == filesLength) {
                $("#dragAndDropError").remove();
                return true;
            } else {
                //filesExtensionsCollecter(acceptFormat);
                $("#dragAndDropError").remove();
                $('#dropzone').after('<div id="dragAndDropError" class="has-error"><small class="errormessage">The file is invalid,or not supported.</small></div>');
            }
            return false;
        }

        vm.mScope.submitHomework = function (homeWork) {

            if (vm.mScope.files.length > 0) {
                var formData = new FormData();
                if (vm.mScope.files.length > 0) {
                    for (var i = 0; i < vm.mScope.files.length; i++) {
                        formData.append("imageList", vm.mScope.files[i]);
                    }
                }
                if (homeWork.submittedHomwork == undefined) {
                    vm.mScope.homework.homeWork = homeWork;
                    formData.append("submittedHomework", JSON.stringify(vm.mScope.homework));
                    $http({
                        method: 'post',
                        url:  commonService.baseApi+'/homework/submitted',
                        headers: {'Content-Type': undefined},
                        data: formData,
                        transformRequest: function (data, headersGetterFunction) {
                            return data;
                        }
                    }).success(function (data, status) {
                        vm.mScope.files = [];
                        vm.cancel();
                        initDataTable();
                    });

                } else {
                    vm.mScope.homework = homeWork.submittedHomwork;
                    formData.append("submittedHomework", JSON.stringify(vm.mScope.homework));
                    $http({
                        method: 'put',
                        url:  commonService.baseApi+'/homework/submitted',
                        headers: {'Content-Type': undefined},
                        data: formData,
                        transformRequest: function (data, headersGetterFunction) {
                            return data;
                        }
                    }).success(function (data, status) {
                        vm.mScope.files = [];
                        vm.mScope.cancel();
                        vm.initclosedHomeWorkDataTable();
                    });
                }

            } else {
                vm.cancel();
            }
        };

        function getSubmittedHomeworkByHomeworkId(data, id) {
            homeWorkService.getSubmittedHomeworkByHomeworkId({id: id}, successCb, errorCb);

            function successCb(result) {
                vm.mScope.submittedHomework = result.entity;
                viewHomework(data);
            }

            function errorCb(error) {
                $log.debug("FAILURE getSubmittedHomeworkByHomeworkId:", error)
            }
        }

        function viewHomework(data) {

            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var lastSubmissionDate = new Date(data.lastDateOfSubmission);
            if (lastSubmissionDate < today) {
                data.submitOption = true;
            }
            data.institute = vm.mScope.instituteType;
            data.today = Date.now();
            if (vm.mScope.submittedHomework) {
                data.submittedImage = vm.mScope.submittedHomework.image;
                data.submittedHomwork = vm.mScope.submittedHomework;

            }

            vm.mScope.modelValue = data;
        }

        vm.mScope.removeSubmittedImage = function (homeWorkPicture, homeWork) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete?')
                .textContent('You will not be able to recover information!')
                .ok('yes, Please it!')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                homeWorkService.removeImage(homeWorkPicture, successCb, errorCb);

                function successCb(result) {
                    getSubmittedHomeworkByHomeworkId(homeWork, homeWork.id);
                    $log.debug("SUCCESS removeImage:", result)
                }

                function errorCb(error) {
                    $log.debug("FAILURE removeImage:", error)
                }
            });
        }

        function getActiveStandardIsRestrict() {
            standardService.getActiveStandardIsRestrict(successCb, errorCb);

            function successCb(result) {
                vm.yearAndStandardList = result;
            }

            function errorCb(error) {
                $log.debug("FAILURE getActiveYearAndStandard:", error)
            }
        }

        function getDepartmentByRole() {
            departmentService.getDepartmentByRole(successCb, errorCb);

            function successCb(result) {
                vm.mScope.departmentList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getDepartmentByRole:", error)
            }
        }

        function getClassYearByRole() {
            standardService.getClassYearByRole(successCb, errorCb);

            function successCb(result) {
                vm.yearAndStandardList = result.entityList;
                vm.mScope.yearAndStandardList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getDepartmentByRole:", error)
            }
        }

    }
})();
