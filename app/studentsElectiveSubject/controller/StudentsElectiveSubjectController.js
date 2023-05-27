(function() {
    'use strict';
    /**
	 * @author Jenis Ephrim
	 */
    angular
        .module('cip.studentsElectiveSubject')
        .controller('StudentsElectiveSubjectController', StudentsElectiveSubjectController);

    StudentsElectiveSubjectController.$inject = ['$log', 'DepartmentService', 'SharedService', 'StandardService', 'SectionService', 'AcademicService', 'StudentService', 'SubjectService' , 'StudentsElectiveSubjectService', 'CommonService'];

    /* @ngInject */
    function StudentsElectiveSubjectController($log, departmentService, sharedService, standardService, sectionService, academicService, studentService, subjectService, studentsElectiveSubjectService, commonService) {
        var vm = this;
       
        vm.init = init;
        vm.getDepartmentList = getDepartmentList;
        vm.getClassYearByDeptId 		    = getClassYearByDeptId;
        vm.getSectionByClassYearId			= getSectionByClassYearId;
        vm.getStudentList	    = getStudentList;
        vm.institute    = sharedService.institute;
        vm.instituteType = sessionStorage.getItem('instituteType');
        vm.attendanceType = vm.institute.attendanceType;
        vm.getSubjectList = vm.getSubjectList;
        vm.subjectElectiveList = vm.subjectElectiveList;
        vm.getElectiveSubjectBySubjectId = getElectiveSubjectBySubjectId;
        vm.saveStudentsElectiveSubject = saveStudentsElectiveSubject;
        vm.getSemesterByClassYear = getSemesterByClassYear;
        
        function init() {
        	if(vm.instituteType == "College") {
        		getDepartmentList();
        	} else {
        		standardService.getActiveStandard( successCb, errorCb);
        		function successCb(result){
        				vm.moveFromClassYear = result.entityList;
        		}
        		function errorCb(error){
        			$log.debug("FAILURE: getActiveStandard",error);
        		}
        	}
        	getAcademic();
        }
        
        function getAcademic() {
			academicService.getAcademic(successCb, errorCb);
			function successCb(result) {
				vm.academicList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getAcademic:",error);
			}
		}
        
        function getDepartmentList() {
        	departmentService.getActiveDepartment(successCb, errorCb);
    		function successCb(result) {
    			vm.departments = result.entityList;
    			vm.semesterList = result.entity;
    		}
    		function errorCb(error){
    			$log.debug("FAILURE getDepartmentList:",error);
    		}
        }
        
        function getClassYearByDeptId(id, option){
        	standardService.getClassByDepartmentId({id}, successCb, errorCb);
        	function successCb(result){
        		if(option=="moveFrom") {
        				vm.moveFromClassYear = result.entityList;
        			}
        		}
        		function errorCb(error){
        			$log.debug("FAILURE getClassYearByDeptId:",error)
        		}
        }
        
        
        function getElectiveSubjectBySubjectId(id, option){
        	subjectService.getElectiveSubjectBySubjectId({id}, successCb, errorCb);
        	function successCb(result){
    			vm.subjectElectiveList = result;
    		}
    		function errorCb(error){
    			$log.debug("FAILURE getSubjectElectiveBySubjectId:",error);
    		}
        }
        
        function getSectionByClassYearId(id, option){
        	sectionService.getSectionByStandardId({id}, successCb, errorCb);
    		function successCb(result){
    			if(option=="moveFrom") {
    				vm.moveFromSectionList = result.entityList;
    			}
    		}
    		function errorCb(error){
    			$log.debug("FAILURE getClassYearByDeptId:",error);
    		}
        }
        
        function getStudentList() {
        	vm.form.classYearId = vm.form.classYear.id;
        	vm.getSubjectListAsElectiveSubject(vm.form.classYearId, vm.form.semester);
        	vm.isCheckAll = false;
        	studentService.getStudentListByAcademic(vm.form, successCb, errorCb);
    		function successCb(result) {
    			vm.studentList = result.entityList;
    		}
    		function errorCb(error){
    			$log.debug("FAILURE getStudentList:",error);
    		}
        }
        
        function getSemesterByClassYear(id){
        	for(var i=0; i<vm.moveFromClassYear.length;i++){
				if(vm.moveFromClassYear[i].id==id){
					vm.semestersLists=commonService.getSemesterByClassYear(vm.moveFromClassYear[i].name);
					i+=vm.moveFromClassYear.length-i;
				}
			}
        };
        
        vm.getSubjectListAsElectiveSubject = function(classYear, semester) {
				subjectService.getStudentSubjectByClassYearId({classYear, semester},successCb, errorCb);
				function successCb(result) {
					vm.subjectList = result.entityList;
				}
				function errorCb(error) {
					$log.debug("FAILURE getSubjectListAsElectiveSubject:",error);
				}
        };
        
        vm.checkAll = function(type) {
        	if(type=='checkAll') {
        		for(var i=0;i<vm.studentList.length;i++) {
        			vm.studentList[i].isUpdate=!vm.isCheckAll;
        			vm.count = vm.studentList[i].isUpdate ? 1 : 0;
            	}
        	} else {
        		vm.count = 0;
        		for(var i=0;i<vm.studentList.length;i++) {
        			if(vm.studentList[i].isUpdate) {
        				vm.count+=1;
        			}
            	}
        		vm.isCheckAll = false;
        		if(vm.count==vm.studentList.length) {
        			vm.isCheckAll = true;
        		}
        	}
        };
        
        function saveStudentsElectiveSubject (data) {
	        for(var i=0;i<vm.studentList.length;i++) {
	    		if(vm.studentList[i].isUpdate) {
	    			vm.studentList[i].subject = data.subject;
	    			vm.studentList[i].subjectElective = data.subjectElective;
	    			vm.studentList[i].student = {id:vm.studentList[i].id};   
	    		} 
	    	}
        	studentsElectiveSubjectService.saveStudentsElectiveSubject(vm.studentList, successCb, errorCb);
        	function successCb(result) {
        		vm.unCheckAll();
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE: saveStudentsElectiveSubject",error);
    		}
        }
        
        vm.unCheckAll = function() {
        	for(var i=0;i<vm.studentList.length;i++) {
        		vm.studentList[i].isUpdate=false;
        	}
        	vm.count = 0;
        	vm.isCheckAll = false;
        };

    }
})();