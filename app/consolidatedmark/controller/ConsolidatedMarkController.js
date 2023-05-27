(function() {
    'use strict';
    /**
     * @author Deepa
     */
    angular
    .module('cip.consolidatedMark')
    .controller('ConsolidatedMarkController', ConsolidatedMarkController);

    ConsolidatedMarkController.$inject = ['$log', '$rootScope', 'AcademicService', 'StandardService', 'SubjectService', 'SharedService', 'DepartmentService', 'SectionService', 'CommonService', 'ConsolidatedMarkService', 'SystemService'];

    /* @ngInject */
    function ConsolidatedMarkController($log, $rootScope, academicService, standardService, subjectService, sharedService, departmentService, sectionService, commonService, consolidatedMarkService, systemService) {

        var vm = this;
        
        vm.form                               = {};
        vm.init                               = init;
        vm.institute                          = sharedService.institute;
        vm.instituteType                      = sessionStorage.getItem('instituteType');
        vm.role                               = sessionStorage.getItem('role');
        vm.getDepartmentList                  = getDepartmentList();
        vm.getSubjectListByClassIdAndSemester = getSubjectListByClassIdAndSemester;
        vm.getClassByDepartmentId             = getClassByDepartmentId;
        vm.getSection                         = getSection;
        vm.getSemesterByClassYear             = getSemesterByClassYear;
        vm.getElectiveSubjectBySubjectId      = getElectiveSubjectBySubjectId;

        function init() {
            academicService.getAcademic({}, successCb, errorCb);
            function successCb(result) {
                vm.academic = result.entityList;
            }
            function errorCb(error) {
                $log.debug("FAILURE getAcademicList:",error);
            }
            if (vm.role == "ROLE_STAFF_HOD") {
                getActiveHodDepartment();
            }

         }
         function getActiveHodDepartment() {
             if(vm.role == "ROLE_STAFF_HOD") {
                 systemService.getUser(successCb, errorCb);
                 function successCb(result) {
                     vm.form.departmentId = result.entity.staff.department.id;
                     getClassByDepartmentId(vm.form.departmentId);
                 }
                 function errorCb(error) {
                     $log.debug("FAILURE getUser:",error)
                 }
             }
         }

        // Get active department list if institute type is college
        function getDepartmentList() {
            departmentService.getCorrespondingAndIsRestrictDepartments(successCb, errorCb);
            function successCb(result) {
                vm.departmentList = result;
            }
            function errorCb(error) {
                $log.debug("FAILURE getCorrespondingAndIsRestrictDepartments:",error);
            }


        }

        // Get active class list by department id
        function getClassByDepartmentId(id) {
            standardService.getCorrespondingAndIsRestrictClassYears({id}, successCb, errorCb);
            function successCb(result) {
                vm.classList = result;
            }
            function errorCb(error) {
                $log.debug("FAILURE getClassByDepartmentId:",error);
            }
        }

        function getSemesterByClassYear(id){
            for(var i=0; i<vm.classList.length;i++){
                if(vm.classList[i].id==id){
                    vm.semestersLists=commonService.getSemesterByClassYear(vm.classList[i].name);
                    i+=vm.classList.length-i;
                }
            }
        };

        function getSection(classYearId, departmentId) {
            sectionService.getCorrespondingAndIsRestrictSections({classYearId: classYearId, departmentId:departmentId}, successCb, errorCb);
            function successCb(result){
                vm.sectionList = result;
            }
            function errorCb(error){
                $log.debug("FAILURE:",error);
            }
        }

        function getSubjectListByClassIdAndSemester(classYearId, semester) {
            subjectService.getSubjectByClassIdAndSemesterId({classYearId, semester},successCb, errorCb);
            function successCb(result) {
                vm.subjectList = result;
            }
            function errorCb(error) {
                $log.debug("FAILURE getSubjectListAsElectiveSubject:",error);
            }
        };
        
        function getElectiveSubjectBySubjectId(id){
            subjectService.getElectiveSubjectBySubjectId({id}, successCb, errorCb);
            function successCb(result){
                vm.subjectElectiveList = result;
            }
            function errorCb(error){
                $log.debug("FAILURE getSubjectElectiveBySubjectId:",error);
            }
        }

        vm.getConsolidatedMark = function(formData) {
            var data = angular.copy(formData);
            data.departmentId = formData.departmentId;
            data.classYearId  = formData.classYearId.id;
            data.sectionId    =    formData.sectionId.id;

            if(formData.subject) {
                data.subject  = formData.subject.id;
            }
            if(!formData.subject) {
                delete data.subject;
                delete data.electiveSubjectId;
            }
            if(formData.subject && !formData.subject.isElective) {
                delete data.electiveSubjectId;
            }
            consolidatedMarkService.getStudentConsolidatedMark(data,successCb, errorCb);
            function successCb(result) {
                if(!vm.form.subject) {
                    vm.subjectWiseConsolidatedMark = false;
                } else {
                    vm.subjectWiseConsolidatedMark = true;
                }
                vm.consolidatedMarkList = result;
            }
            function errorCb(error) {
                $log.debug("FAILURE getStudentConsolidatedMark:",error);
            }
        }
        
        vm.getCurrentDate = function() {
            var monthName = new Array('January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
                var dateObj = new Date();
                vm.consolidatedYear = {month:monthName[dateObj.getMonth()], year: dateObj.getFullYear()};
        }

        vm.exportStudentConsolidatedMark = function() {
            if (!window.Blob) {
                alert('Your legacy browser does not support this action.');
                return;
            }
            var html, link, blob, url, css;
            css = (
                    '<style>' +
                    '@page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
                    'div.WordSection1 {page: WordSection1;}' + 'div.marksheet{text-align: center;font-family:initial;font-size: 20px;}'+'div.year{font-size: 15px;font-weight: bold;font-family: serif;text-align:left;}'+
                    'table{border-collapse:collapse;table-layout: fixed;}tr{text-align:center}td{border:1px gray solid;width:6em;padding:2px;}th{border:1px gray solid;width:6em;padding:2px;}'+
                    '</style>'
            );
            
            html = window.table.innerHTML;
            
            html += '<table align="center" id=subjectTable>'+
            '<thead><tr><th style="text-align:left;width:1em;">S.No</th><th style="text-align:left;">Subject Code</th><th  style="text-align:left;">Subject Name</th></tr></thead><tbody>';
            for(var i=0; i<vm.consolidatedMarkList[0].subjectMarks.length;i++) {
                html += '<tr><td style="text-align:left;width:1em;">'+(i+1)+'</td><td style="text-align:left;">'+vm.consolidatedMarkList[0].subjectMarks[i].subject+'</td><td style="text-align:left;width:20em;">'+vm.consolidatedMarkList[0].subjectMarks[i].subjectName+'</td>';
                html +='</tr>';
            }
            
            html +='</td></tr>';
            html += '</tbody></table><br><br><br>';
            
            html += '<table id="footerTable" style="width:900px;">'+
            '<thead><tr><th colspan="3" style="border:0;text-align:left" >Class Advisor</th><th colspan="3" style="border:0;text-align:center">HOD</th><th colspan="3" style="border:0;text-align:right">Principal</th></tr><thead>'+
            '<tbody><td colspan="3" style="border:0;"></td><td colspan="3" style="border:0;"></td><td colspan="3" style="border:0;"></td></tbody></table>';
            
            blob = new Blob(['\ufeff', css + html], {
                type: 'application/msword'
            });
            url = URL.createObjectURL(blob);
            link = document.createElement('A');
            link.href = url;
            link.download = 'ConsolidatedMark';  
            document.body.appendChild(link);
            if (navigator.msSaveOrOpenBlob ) {
                navigator.msSaveOrOpenBlob( blob, 'ConsolidatedMark.doc');
            } 
            else {
                link.click();
            }
            document.body.removeChild(link);
        };
    }
})();