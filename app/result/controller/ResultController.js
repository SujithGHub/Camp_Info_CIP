(function () {
    'use strict';
    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.result')
        .controller('ResultController', ResultController);

    ResultController.$inject = ['$mdDialog', '$http', 'ResultService', '$scope', 'SharedService', 'ngTableParams', '$state', 'AcademicService', 'StandardService', '$log', 'SectionService', 'ExaminationService', 'SubjectService', 'FileDownloadService', 'DepartmentService', '$timeout', '$location', '$mdToast', 'StudentService', 'CommonService', 'SystemService'];

    /* @ngInject */
    function ResultController($mdDialog, $http, resultService, $scope, SharedService, ngTableParams, $state, academicService, standardService, $log, sectionService, examinationService, subjectService, fileDownloadService, departmentService, $timeout, $location, $mdToast, studentService, commonService, systemService) {

        var vm = this;

        vm.init = init;
        vm.initResultImport = initResultImport;
        vm.mScope = [];
        vm.mScope.files = [];
        vm.mScope.getSectionByClassId = getSectionByClassId;
        vm.mScope.getSubjectByExamId = getSubjectByExamId;
        vm.mScope.getClassByDepartmentId = getClassByDepartmentId;
        vm.mScope.getExamByClassAndAcademicId = getExamByClassAndAcademicId;
        vm.mScope.getElectiveSubjectBySubjectId = getElectiveSubjectBySubjectId;

        vm.checkCondition = checkCondition;
        vm.setResult = setResult;
        vm.getExamByRollNo = getExamByRollNo;
        vm.getResultByExamAndRollNo = getResultByExamAndRollNo;
        vm.getResult = getResult;
        vm.getExaminationByStudent = getExaminationByStudent;
        vm.getResultByExamination = getResultByExamination;
        vm.getData = getData;
        $scope.reportStatus = 0;

        vm.studentRollNo = SharedService.studentRollNo;
        vm.studentsResult = SharedService.studentsResult;
        $scope.resultData = SharedService.resultData;
        var userDetails = SharedService.userDetails;
        vm.roles = sessionStorage.getItem('role');
        var result = [];
        vm.saveOrUpdateResult = saveOrUpdateResult;
        vm.updateOrDeleteResultByRollNumber = updateOrDeleteResultByRollNumber;
        vm.institute = SharedService.institute;
        vm.mScope.instituteType = sessionStorage.getItem('instituteType');
        vm.getStudentList = getStudentList;
        vm.showUploadForm = showUploadForm;
        vm.mScope.imageUpload = imageUpload;

        function init() {
            vm.form = {};
            if (vm.mScope.instituteType == "College") {
                getDepartmentByRole()
            } else {
                getYearAndStandard();
            }
            getAcademic();
        };

        vm.mScope.cancel = function () {
            $scope.$broadcast('closeModel');
        };


        //Get active department list if institute type as college
        function getDepartmentByRole() {
            departmentService.getDepartmentByRole(successCb, errorCb);

            function successCb(result) {
                vm.mScope.departmentList = result.entityList;
                //vm.mScope.semesterList = result.entity;
            }

            function errorCb(error) {
                $log.debug("FAILURE getActiveDepartmentList:", error)
            }
        }

        function getActiveHodDepartment() {
            if (vm.roles == "ROLE_STAFF_HOD") {
                vm.mScope.roles = userDetails.roles[0].name;
                systemService.getUser(successCb, errorCb);

                function successCb(result) {
                    vm.form.department = result.entity.staff.department.id;
                    getClassByDepartmentId(vm.form.department);
                }

                function errorCb(error) {
                    $log.debug("FAILURE getUser:", error)
                }
            }
        };

        function initResultImport() {
            vm.JSONtemplate = {'url': "/app/result/views/resultTemplate.html", "title": "Result", "okText": "DOWNLOAD"};
            init();
        }

        function getAcademic() {
            academicService.getAcademic(successCb, errorCb);

            function successCb(result) {
                vm.mScope.academicList = result.entityList;
                var currentDate = new Date();
                for (var i = 0; i < vm.mScope.academicList.length; i++) {
                    var fromDate = new Date(vm.mScope.academicList[i].fromDate);
                    var toDate = new Date(vm.mScope.academicList[i].toDate);
                    if (fromDate <= currentDate && currentDate <= toDate) {
                        vm.form.academic = {id: vm.mScope.academicList[i].id};
                    }
                }
            }

            function errorCb(error) {
                $log.debug("FAILURE getAcademic:", error)
            }
        };

        //Get active department list
        function getActiveDepartmentList() {
            if (vm.institute.restrictedAttendance && vm.roles == 'ROLE_STAFF') {
                departmentService.getActiveDepartmentIsRestrict(successCb, errorCb);
            } else {
                departmentService.getActiveDepartment(successCb, errorCb);
            }

            function successCb(result) {
                vm.mScope.departmentList = result.entityList;
                vm.mScope.semesterList = result.entity;
            }

            function errorCb(error) {
                $log.debug("FAILURE getActiveDepartmentList:", error)
            }
        };

        function getYearAndStandard() {
            /*if(vm.institute.restrictedAttendance && vm.roles == 'ROLE_STAFF') {*/
            /*} else {
                standardService.getActiveStandard(successCb, errorCb);
            }*/
            standardService.getClassYearByRole(successCb, errorCb);

            function successCb(result) {
                vm.mScope.yearAndStandardList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getActiveYearAndStandard:", error)
            }
        }

        // Get semester by class year
        vm.mScope.getSemesterByClassYear = function (id) {
            for (var i = 0; i < vm.mScope.yearAndStandardList.length; i++) {
                if (vm.mScope.yearAndStandardList[i].id == id) {
                    vm.mScope.semestersLists = commonService.getSemesterByClassYear(vm.mScope.yearAndStandardList[i].name);
                    i += vm.mScope.yearAndStandardList.length - i;
                }
            }
        };

        // Get active class year list by deparment id
        function getClassByDepartmentId(id) {
            resetSearchValues("year");

            standardService.getClassYearByDepartmentAndRole({id}, successCb, errorCb);

            function successCb(result) {
                vm.mScope.yearAndStandardList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getClassByDepartmentId:", error)
            }

            /*if(vm.institute.restrictedAttendance && vm.roles == 'ROLE_STAFF') {
                standardService.getClassYearByDepartmentIdIsRestrict({id}, successCb, errorCb);
                function successCb(result) {
                    vm.mScope.yearAndStandardList = result;
                }
                function errorCb(error) {
                    $log.debug("FAILURE getClassByDepartmentId:",error)
                }
            } else {
                standardService.getClassByDepartmentId({id}, successCb, errorCb);
                function successCb(result) {
                    vm.mScope.yearAndStandardList = result.entityList;
                }
                function errorCb(error) {
                    $log.debug("FAILURE getClassByDepartmentId:",error)
                }
            }*/

        };

        function getSectionByClassId(id, isSemester) {
            if (!id) return;
            if (isSemester) {
                if (vm.mScope.mForm != undefined && vm.mScope.mForm.semester != undefined) {
                    delete vm.mScope.mForm.semester;
                }
                vm.form.semester = "";
            }
            resetSearchValues("section");
            if (vm.institute.restrictedAttendance && vm.roles == 'ROLE_STAFF') {
                $http.get( commonService.baseApi+'/subjectallotment/section/' + id)
                    .success(function (data, status, headers, config) {
                        if (data != "" && data != undefined) {
                            vm.mScope.sectionList = data;
                        }
                    });
            } else {
                sectionService.getSectionByStandardId({id}, successCb, errorCb);

                function successCb(result) {
                    vm.mScope.sectionList = result.entityList;
                }

                function errorCb(error) {
                    $log.debug("FAILURE getSectionByClassId:", error);
                }
            }
        }

        function getExamByClassAndAcademicId(classId, academicId, sectionId, semester) {
            if (!classId) return;
            resetSearchValues("examination");

            if (semester) {
                examinationService.getExamByClassSectionAcademicIdAndSemester({
                    classId: classId,
                    academicId: academicId,
                    semester: semester,
                    sectionId: sectionId
                }, successCb, errorCb);
            } else {
                examinationService.getExamByClassSectionAndAcademicId({
                    classId,
                    academicId,
                    sectionId
                }, successCb, errorCb);
            }

            function successCb(result) {
                vm.mScope.examinationList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getExaminationByClass:", error);
            }
        }

        function getSubjectByExamId(id) {
            if (!id) return;
            vm.mScope.subjectList = [];
            vm.mScope.subjectsList = [];

            resetSearchValues("subject");

            subjectService.getSubjectByExamId({id}, successCb, errorCb);

            function successCb(result) {
                vm.mScope.subjectsList = (result.entityList).filter(function (item) {
                    if (vm.mScope.subjectList.indexOf(item.subject.id) === -1) {
                        return vm.mScope.subjectList.push(item.subject.id);
                    }
                });
            }
            function errorCb(error) {
                $log.debug("FAILURE getSubjectByExamId:", error);
            }
        }
        function getElectiveSubjectBySubjectId(id, examId, type) {
            if (!id) return;
            vm.mScope.subjectElectiveList = [];
            if (type == "ModelForm") {
                delete vm.mScope.mForm.subjectElective;
            } else if (type == "NonModelForm") {
                delete vm.form.subjectElective;
            }

            for (var i = 0; i < vm.mScope.subjectsList.length; i++) {
                if (vm.mScope.subjectsList[i].subject.id == id && vm.mScope.subjectsList[i].subject.isElective) {
                    examinationService.getExamPaperByExamAndSubjectId({id: id, examId: examId}, successCb, errorCb);

                    function successCb(result) {
                        vm.mScope.subjectElectiveList = result.entityList;
                        $log.debug("SUCCESS getSubjectByExamId", result);
                    }

                    function errorCb(error) {
                        $log.debug("FAILURE getSubjectByExamId:", error);
                    }
                }
            }
        }

        function resetSearchValues(type) {
            switch (type) {
                case "year" :
                    vm.mScope.yearAndStandardList = [];
                    if (vm.mScope.mForm) {
                        delete vm.mScope.mForm.classYear;
                    }
                    vm.form.classYear = "";
                case "semester" :
                    if (vm.mScope.mForm) {
                        delete vm.mScope.mForm.semester;
                    }
                    vm.form.semester = "";
                case "section" :
                    vm.mScope.sectionList = [];
                    if (vm.mScope.mForm) {
                        delete vm.mScope.mForm.section;
                    }
                    vm.form.section = "";
                case "examination" :
                    vm.mScope.examinationList = [];
                    if (vm.mScope.mForm) {
                        delete vm.mScope.mForm.examination;
                    }
                    vm.form.examination = "";
                case "subject" :
                    if (vm.mScope.mForm) {
                        delete vm.mScope.mForm.subject;
                    }
                    if (vm.mScope.mForm) {
                        delete vm.mScope.mForm.subjectElective;
                    }
                    vm.form.subject = "";
                    vm.form.subjectElective = "";
            }
        }

        vm.fileUpload = function (formData) {
            if (vm.roles == "ROLE_STAFF_HOD") {
                formData.department = {id: formData.department};
            }
            formData.name = "Result";
            vm.examName = formData.examName;
            vm.file = angular.element(document.getElementById('fileInput'));
            var data = new FormData();
            data.append('file', vm.file[0].files[0]);
            data.append('name', formData.name);
            data.append('examName', vm.examName);
            data.append("data", JSON.stringify(formData));
            $http({
                method: 'post',
                url:  commonService.baseApi+'/bulk/',
                headers: {'Content-Type': undefined},
                data: data,
                transformRequest: function (data, headersGetterFunction) {
                    return data;
                }
            }).success(function (data, status) {
                vm.data = data;

                var count = 0;
                var keyArr = Object.keys(vm.data);
                for (var i = 0; i < keyArr.length; i++) {
                    var val = vm.data[keyArr[i]];
                    if (val.length) {
                        count++;
                    }
                }
                if (count) {
                    vm.mScope.error = data;
                    vm.JSONtemplate = {
                        'url': "/app/result/views/resultUploadError.html",
                        "title": "Import File Error",
                        "okText": ""
                    };
                    vm.form = {};
                    $scope.$broadcast('modelForm');
                } else {
                    $mdToast.show({
                        template: '<md-toast class="md-toast ng-scope md-dark-teal-theme md-top"><div class="md-toast-content success "><span flex="" role="alert" aria-relevant="all" aria-atomic="true" class="ng-binding flex">  File Uploaded successfully ! </span></div></md-toast>',
                        hideDelay: 5000,
                        position: 'top'
                    });
                    $state.reload();
                }
            }).error(function (data, status) {

            });
        }

        vm.downloadTemplate = function (data) {
            data.name = "Result";
            fileDownloadService.downloadTemplate(data, vm.mScope.instituteType);
        }


        function getExamByRollNo() {
            var rollNo = vm.studentRollNo
            setTimeout(function () {
                resultService.initTable('examDataTable', {rollNo: rollNo});
            }, 100)
            $(".content").mCustomScrollbar({theme: "dark-3", axis: "y"});

        }

        vm.studentsResultValue = function studentsResultValue(status) {
            SharedService.setStudentsResult(status);
            var rollNo = null;
            SharedService.setStdRollNo(rollNo);
            vm.studentsResult = SharedService.studentsResult;
        }

        function getExaminationByStudent() {
            vm.studentRollNo = userDetails.student.rollNumber;
            getExamByRollNo();
        }

        function studentResult(formData, status) {
            SharedService.setStudentsResult(status);
            vm.studentsResult = SharedService.studentsResult;
            SharedService.setStudentRollNo(formData.rollNo);
            vm.studentRollNo = SharedService.studentRollNo;

        }

        function checkCondition(formData, value) {
            if (value == 1) {
                var rollNo = formData.rollNo;
                studentService.getStudentByRollNumber({rollNo}, successCb, errorCb);

                function successCb(result) {
                    studentResult(formData, value);
                    $log.debug("SUCCESS getStudentByRollNumber", result);
                }

                function errorCb(error) {
                    $log.debug("FAILURE getStudentByRollNumber:", error);
                }
            } else {
                studentResult(formData, value);
            }
        }

        function setResult(result) {
            if (vm.roles == "ROLE_STAFF_HOD") {
                result.department = {id: result.department}
            }
            var results = {result}
            SharedService.setResultData(results);
            vm.setResultData = results;
            $state.go('viewResult');
        }

        function getValue() {
            var data = {};
            var table = $('#examDataTable').dataTable();
            $(".selected", table.fnGetNodes()).each(function () {
                data = table.fnGetData($(this).parents())
                $(this).removeClass('selected');
            });
            setResult(data);
        }

        $scope.setResult = function () {
            setTimeout(function () {
                getValue();
            }, 0);
        };

        function getResultByExamAndRollNo() {
            var id = $scope.resultData.result.id;
            var rollNo = vm.studentRollNo;
            resultService.getResultByExamAndRollNo({id, rollNo}, successCb, errorCb);

            function successCb(result) {
                $scope.resultList = result.entityList;
                $scope.tableValue = result.entityList;
                $scope.average = $scope.resultList[0].avgMark;
                $log.debug("SUCCESS getResultByExamAndRollNo", result);
            }

            function errorCb(error) {
                $log.debug("FAILURE getResultByExamAndRollNo:", error);
            }
        }

        function getResult() {
            var formData = ($scope.resultData.result == null) ? null : $scope.resultData.result;
            result = [];
            if (formData) {
                vm.className = formData.classYear.name;
                vm.sectionName = formData.section.sectionName;
                vm.subjectName = formData.subject.subjectName;
                vm.examName = formData.examination.examName;
                result.push(formData.academic.id);
                result.push(formData.classYear.id);
                result.push(formData.examination.id);
                result.push(formData.section.id);
                result.push(formData.subject.id);
                if (formData.subjectElective) {
                    result.push(formData.subjectElective.id);
                    vm.subjectElectiveName = formData.subjectElective.electiveSubjectName;
                } else {
                    result.push(null);
                }
                if (formData.department) {
                    result.push(formData.department.id);
                    result.push(formData.semester);
                    vm.departmentName = formData.department.displayName;
                }
                getResultList(result);
            } else {
                $scope.resultList = [];
            }
        }


        function getResultList(result) {
            $(".content").mCustomScrollbar({theme: "dark-3", axis: "y"});
            resultService.getResultBySubject('resultBySubjectTable', {result});

            $timeout(function () {
                if (SharedService.passPercentage) {
                    $scope.passPercentage = SharedService.passPercentage.toFixed(2);
                } else {
                    $scope.passPercentage = 0;
                }

                $scope.totalCount = SharedService.totalCount;
            }, 1000);
        }

        function saveOrUpdateResult(formData) {
            if (formData.subjectElective && !formData.subjectElective.id) {
                delete formData.subjectElective;
            }
            if (formData.department && !formData.department.id) {
                delete formData.department;
            }
            resultService.updateResult(formData, successCb, errorCb);

            function successCb(result) {
                if (vm.resultType === "resultBySubject") {
                    getResult();
                } else if (vm.resultType === "resultByRollNumber") {
                    getResultByExamAndRollNo();
                }
            }

            function errorCb(error) {
                $log.debug("FAILURE UpdateResult:", error)
            }

        };


        $scope.updateOrDeleteResult = function (type) {
            vm.resultType = "resultBySubject"
            setTimeout(function () {
                getResultValue(type);
            }, 0);
        };

        //Get edit and delete data from datatable
        function getResultValue(type) {
            var data = {};
            var table = $('#resultBySubjectTable').dataTable();
            $(".selected", table.fnGetNodes()).each(function () {
                data = table.fnGetData($(this).parents())
                $(this).removeClass('selected');
            });
            if (type == "update") {
                vm.initData = data;
                $scope.$broadcast('modelForm');
            }

        };

        function updateOrDeleteResultByRollNumber(data) {
            vm.resultType = "resultByRollNumber"
            vm.initData = data;
            $scope.$broadcast('modelForm');
        }

        function getResultByExamination() {
            var id = $scope.resultData.result.id;
            resultService.getResultByExaminationId({id}, successCb, errorCb);

            function successCb(result) {
                $scope.resultList = result.entityList;
                $scope.tableValue = result.entityList;
                $scope.average = $scope.resultList[0].avgMark;
                $log.debug("SUCCESS getResultByExamination", result);
            }

            function errorCb(error) {
                $log.debug("FAILURE getResultByExamination:", error);
            }
        }

        $scope.reportStatus = 0;
        if (SharedService.stdRollNo != null) {
            var form = {
                'rollNo': SharedService.stdRollNo
            }
            checkCondition(form, 1);
            $scope.reportStatus = SharedService.reportStatus;
        }

        /*
         * Get all data for export
         */
        function getData(documentType) {
            var search = '';
            $http.get( commonService.baseApi+'/result/subject?start=' + 0 + '&limit=' + $scope.totalCount + '&searchValue=' + search + '&result=' + result)
                .success(function (data, status, headers, config) {
                    var resultFullList = data.entityList;
                    var html = '<div class="card-header">';
                    if (vm.mScope.instituteType == 'College' || vm.roles == 'ROLE_SUPER_ADMIN') {
                        html += '<h5>Department : <small>' + $scope.resultData.result.department.name + '</small></h5>' +
                            '<h5>Year : <small>' + $scope.resultData.result.classYear.name + '</small></h5>' +
                            '<h5>Section : <small>' + $scope.resultData.result.section.sectionName + '</small></h5>' +
                            '<h5>Semester : <small>' + $scope.resultData.result.examination.semester + '</small></h5>';
                    }
                    else {
                        html += '<h5>Standard : <small>' + $scope.resultData.result.classYear.name + '</small></h5>' +
                            '<h5>Section : <small>' + $scope.resultData.result.section.sectionName + '</small></h5>';
                    }
                    html += '<h5>Exam : <small>' + $scope.resultData.result.examination.examName + '</small></h5>' +
                        '<h5>Subject : <small>' + $scope.resultData.result.subject.subjectName + '</small></h5>' +
                        '<h5>Pass Percentage : <small>' + resultFullList[0].avgMark.toFixed(2) + '</small></h5></div>' +
                        '<table id="resultTable">' +
                        '<thead><tr><th>S.No</th><th>Student Name</th><th>Max Marks</th><th>Pass Mark</th><th>Marks Obtained</th></tr></thead>' +
                        '<tbody>';
                    for (var i = 0; i < resultFullList.length; i++) {
                        html += '<tr><td>' + (i + 1) + '</td><td>' + resultFullList[i].student.firstName + '</td><td>' + resultFullList[i].maxMark +
                            '</td><td>' + resultFullList[i].passMark + '</td><td>' + resultFullList[i].mark + '</td></tr>';
                    }
                    html += '</tbody>' +
                        '</table>';
                    $('#htmlContent').append(html);
                    if (documentType == 'pdf') {
                        $('#htmlContent').show();
                        getDocument();
                        $('#htmlContent').hide();
                    }
                    else {
                        $('#htmlContent').show();
                        $('#resultTable').tableExport({type: 'excel', escape: false, fileName: 'Result'});
                        $('#htmlContent').hide();
                        $location.path('/viewResult');
                    }
                });
        }

        /*
         * Generate Pdf document
         */
        function getDocument() {
            var pdf = new jsPDF('p', 'pt', 'letter')
            var source = $('#htmlContent')[0]
            var margins = {
                top: 20,
                bottom: 20,
                left: 40,
                width: 522
            };
            pdf.fromHTML(
                source,
                margins.left,
                margins.top,
                {
                    'width': margins.width
                },
                function (dispose) {
                    pdf.save('Result.pdf');
                },
                margins
            )
            $location.path('/viewResult');
        }

        $scope.readFile = function (element) {
            $scope.$apply(function (scope) {
                if ($(element)[0].files.length) {
                    $scope.fileName = $(element)[0].files[0].name;
                }
            });
        };

        vm.mScope.clearFile = function () {
            $scope.fileName = '';
            $("#fileInput").val('');
            vm.mScope.files = [];
            vm.mScope.upload = '';

        };

        vm.changeHeight = function () {
            if (vm.form.searchType == "Subject") {
                if (vm.institute.instituteType == "College") {
                    document.getElementById("viewResultBySubject").style.cssText = "height : 750px";
                } else {
                    document.getElementById("viewResultBySubject").style.cssText = "height : 512px";
                }

            } else {
                document.getElementById("viewResultBySubject").style.cssText = "height : 215px";
            }

        };

        function getStudentList() {
            var data = {};
            if (vm.mScope.instituteType == "College") {
                data.departmentId = vm.imageForm.department.id;
                data.semester = vm.imageForm.semester;
            }
            data.academicId = vm.imageForm.academic.id;
            data.classYearId = vm.imageForm.classYear.id;
            data.sectionId = vm.imageForm.section.id;
            studentService.getStudentListByAcademic(data, successCb, errorCb);

            function successCb(result) {
                vm.studentList = result.entityList;
            }

            function errorCb(error) {
                $log.debug("FAILURE getStudentList:", error)
            }
        }

        function showUploadForm(student) {
            $scope.students = student;
            var id = vm.imageForm.examination.id;
            var rollNo = student.rollNumber;
            resultService.getResultImageByExaminationAndRollNo({id: id, rollNo: rollNo}, successCb, errorCb);

            function successCb(result) {
                var imageList = result.entityList;
                var form = {};
                form = result.entity;
                vm.mScope.imageFormData = vm.imageForm;
                vm.mScope.studentData = student;
                vm.mScope.imageList = imageList;
                vm.mScope.form = form;
                $("#result-upload").click();
            }

            function errorCb(error) {
                $log.debug("FAILURE getResultImageByExamination:", error);
            }
        }

        vm.mScope.erMessage = function erMessage() {

            $mdToast.show({
                template: '<md-toast class="md-toast ng-scope md-dark-teal-theme md-top"><div class="md-toast-content failure"><span flex="" role="alert" aria-relevant="all" aria-atomic="true" class="ng-binding flex">  Please enter remarks or upload files ! </span></div></md-toast>',
                hideDelay: 5000,
                position: 'top'
            });
        };

        function imageUpload() {
            var formData = new FormData();
            if (vm.mScope.files.length > 0) {
                for (var i = 0; i < vm.mScope.files.length; i++) {
                    formData.append("file", vm.mScope.files[i]);

                }
            }
            var department = {}
            if (vm.mScope.instituteType == "College") {
                department.id = vm.imageFormData.department.id;
            }
            var academic = {};
            academic.id = vm.mScope.imageFormData.academic.id;
            var classYear = {};
            classYear.id = vm.mScope.imageFormData.classYear.id;
            var section = {};
            section.id = vm.mScope.imageFormData.section.id;
            var examination = {};
            examination.id = vm.mScope.imageFormData.examination.id;
            var student = {};
            student.id = vm.mScope.studentData.id;
            var remarks;
            if (vm.mScope.form) {
                remarks = vm.mScope.form.remarks;
                vm.saveFile = true;
                if (vm.mScope.form.id) {
                    vm.saveFile = false;
                }
            } else {
                remarks = "";
                vm.saveFile = true;
            }
            if (vm.mScope.form != undefined || vm.mScope.files.length > 0) {
                if (vm.saveFile) {
                    formData.append("academic", JSON.stringify(academic));
                    formData.append("department", JSON.stringify(department));
                    formData.append("classYear", JSON.stringify(classYear));
                    formData.append("section", JSON.stringify(section));
                    formData.append("examination", JSON.stringify(examination));
                    formData.append("student", JSON.stringify(student));
                    formData.append("remarks", remarks);
                    $http({
                        method: 'post',
                        url:  commonService.baseApi+"/result/upload/image",
                        headers: {'Content-Type': undefined},
                        data: formData,
                        transformRequest: function (data, headersGetterFunction) {
                            return data;
                        }
                    }).success(function (data, status) {
                        vm.mScope.cancel();
                        vm.mScope.files = [];
                    });
                } else {
                    formData.append("result", JSON.stringify(vm.mScope.form));
                    formData.append("remarks", remarks);
                    $http({
                        method: 'post',
                        url:  commonService.baseApi+"/result/update/bulk",
                        headers: {'Content-Type': undefined},
                        data: formData,
                        transformRequest: function (data, headersGetterFunction) {
                            return data;
                        }
                    }).success(function (data, status) {
                        vm.mScope.cancel();
                        vm.mScope.files = [];
                    });
                }
            }
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
                $("#dragAndDropError").remove();
                $('#dropzone').after('<div id="dragAndDropError" class="has-error"><small class="errormessage">The file is invalid,or not supported.</small></div>');
            }
            return false;
        }

        vm.viewImage = function (type) {
            var id = $scope.resultData.result.id;
            resultService.getResultImageByExamination({id}, successCb, errorCb);

            function successCb(result) {
                var data = result.entityList;
                var result = result.entity;
                $mdDialog.show({
                    controller: ResultController,
                    controllerAs: 'resultCtrl',
                    templateUrl: '/app/result/views/viewResultFiles.html',
                    parent: angular.element(document.body),
                    bindToController: true,
                    locals: {
                        scopeValue: data,
                        result: result
                    },
                    clickOutsideToClose: false
                })
                $log.debug("SUCCESS getResultImageByExamination", result);
            }

            function errorCb(error) {
                $log.debug("FAILURE getResultImageByExamination:", error);
            }
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        }

        vm.mScope.removeImage = function (resultImage) {
            var confirm = $mdDialog.confirm()
                .title('Are you sure want to delete?')
                .textContent('You will not be able to recover information!')
                .ok('yes, Please it!')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                resultService.removeImage(resultImage, successCb, errorCb);

                function successCb(result) {
                    vm.mScope.imageList = [];
                    $scope.apply();
                    $log.debug("SUCCESS removeImage:", result)
                }

                function errorCb(error) {
                    $log.debug("FAILURE removeImage:", error)
                }
            });
        };

    }
})();