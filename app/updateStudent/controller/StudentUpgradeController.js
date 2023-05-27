(function() {
    'use strict';
    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.studentUpgrade')
        .controller('StudentUpgradeController', StudentUpgradeController);

    StudentUpgradeController.$inject = ['$log', 'DepartmentService', 'SharedService', 'StandardService', 'SectionService', 'AcademicService', 'StudentService', 'CommonService'];

    /* @ngInject */
    function StudentUpgradeController($log, departmentService, sharedService, standardService, sectionService, academicService, studentService, commonService) {
        var vm = this;
       
        vm.init 							= init;
        vm.getDepartmentList 				= getDepartmentList;
        vm.getClassYearByDeptId 		    = getClassYearByDeptId;
        vm.getSectionByClassYearId			= getSectionByClassYearId;
        vm.getStudentList	    			= getStudentList;
        var userDetails 					= sharedService.userDetails;
        vm.institute    					= sharedService.institute;
        vm.instituteType 					= sessionStorage.getItem('instituteType');
        vm.attendanceType 					= vm.institute.attendanceType;
        vm.getSemesterByClassYear			= getSemesterByClassYear;
        
        function init() {
        	
        	if(vm.instituteType == "College") {
        		getDepartmentList();
        	} else {
        		standardService.getActiveStandard( successCb, errorCb);
        		function successCb(result){
        				vm.moveFromClassYear = result.entityList;
        				vm.moveToClassYear = result.entityList;
        		}
        		function errorCb(error){
        			$log.debug("FAILURE: getActiveStandard",error)
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
				$log.debug("FAILURE getAcademic:",error)
			}
		};
        
        function getDepartmentList() {
        	
        	departmentService.getActiveDepartment(successCb, errorCb);
    		function successCb(result) {
    			vm.departments = result.entityList;
    		}
    		function errorCb(error){
    			$log.debug("FAILURE getDepartmentList:",error)
    		}
        }
        
        function getClassYearByDeptId(id, option){
        	
        	standardService.getClassByDepartmentId({id}, successCb, errorCb);
        		function successCb(result){
        			
        			if(option=="moveFrom") {
        				vm.moveFromClassYear = result.entityList;
        			}
        			else {
        				vm.moveToClassYear = result.entityList;
        			}
        		}
        		function errorCb(error){
        			$log.debug("FAILURE getClassYearByDeptId:",error)
        		}
        }
        
        function getSectionByClassYearId(id, option){
        	
        	sectionService.getSectionByStandardId({id}, successCb, errorCb);
    		function successCb(result){
    			if(option=="moveFrom") {
    				vm.moveFromSectionList = result.entityList;
    			}
    			else {
    				vm.moveToSectionList = result.entityList;
    			}
    		}
    		function errorCb(error){
    			$log.debug("FAILURE getClassYearByDeptId:",error)
    		}
        }
        
        function getStudentList() {
        	vm.isCheckAll = false;
        	studentService.getStudentListByAcademic(vm.form, successCb, errorCb);
    		function successCb(result) {
    			vm.studentList = result.entityList;
    		}
    		function errorCb(error){
    			$log.debug("FAILURE getStudentList:",error)
    		}
        }
        
        function getSemesterByClassYear(id, option){
        	if(option=="moveFrom") {
				vm.classYearList = vm.moveFromClassYear;
			} else {
				vm.classYearList = vm.moveToClassYear;
			}
        	for(var i=0; i<vm.classYearList.length;i++){
				if(vm.classYearList[i].id==id) {
					if(option=="moveFrom") {
						vm.moveFromsemesterList=commonService.getSemesterByClassYear(vm.classYearList[i].name);
					} else {
						vm.moveTosemesterList=commonService.getSemesterByClassYear(vm.classYearList[i].name);
					}
					i+=vm.classYearList.length-i;
				}
			}
        };
        
        vm.updateStudentDetails = function(data) {
        	console.log(vm.studentList.length)
        	for(var i=0;i<vm.studentList.length;i++) {
        		if(vm.studentList[i].isUpdate) {
        			vm.studentList[i].academic = data.academic;
        			vm.studentList[i].classYear = data.classYear;
        			vm.studentList[i].section = data.section;
        			if(vm.instituteType == "College") {
        				vm.studentList[i].department = data.department;
        				vm.studentList[i].semester = data.semester;
        			}
        		} 
        	}
        	console.log(vm.studentList)
        	studentService.updateStudentAcademic(vm.studentList, successCb, errorCb);
        	function successCb(result) {
        		vm.count = 0;
        		getStudentList();
        	}
        	function errorCb(result) {
        		$log.debug("FAILURE updateStudentDetails:",error)
        	}
        }
        
        
        vm.updatePassoutStudentDetails = function() {
        	console.log(vm.studentList.length)
        	studentService.updatePassoutStudent(vm.studentList, successCb, errorCb);
        	function successCb(result) {
        		vm.count = 0;
        		getStudentList();
        	}
        	function errorCb(result) {
        		$log.debug("FAILURE updateStudentDetails:",error)
        	}
        }
        
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
        } 
        	
    }
})();