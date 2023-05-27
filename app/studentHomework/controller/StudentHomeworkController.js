(function() {
    'use strict';
    angular
        .module('cip.studentHomework')
        .controller('StudentHomeworkController', StudentHomeworkController);

    StudentHomeworkController.$inject = ['$log', '$http', 'CommonService', '$scope', 'ngTableParams', 'SharedService', '$rootScope', 'SharedService', 'SectionService','StandardService', 'DepartmentService','SubjectService','StudentHomeworkService','$mdDialog'];

    /* @ngInject */
    function StudentHomeworkController($log, $http, commonService, $scope, ngTableParams, SharedService, $rootScope, sharedService, sectionService, standardService, departmentService,subjectService,studentHomeworkService,$mdDialog) {
    	
    	var vm = this;
    	vm.init 				= init;
    	vm.getClassYearsByDepartmentAndStaff= getClassYearsByDepartmentAndStaff;
    	vm.getSection = getSection;
    	vm.openNav              = openNav;
		vm.closeNav             = closeNav;
		vm.homeworkList 		= [];
		vm.mScope               = {};
    	var userDetails = sharedService.userDetails;
    	vm.institute = sharedService.institute;
    	vm.instituteType = sessionStorage.getItem('instituteType');
    	vm.role =sessionStorage.getItem('role');

    	function init() {

    		if(vm.instituteType =='College') {
                getDepartmentByRole();
                getClassYearByRole();
    		} else {
                getClassYearByRole();
    		}
    		openNav();
    		vm.showTable=true;
    	}
    	
    	function getClassYearsByDepartmentAndStaff(id){
    		vm.form.classYear = undefined;
    		vm.form.section = undefined;
    		
    		standardService.getClassYearsByDepartmentAndStaff({id:id}, successCb, errorCb);
			function successCb(result){
				vm.classYear = result;
			}
			function errorCb(error){
				$log.debug("FAILURE:",error)
			}
    	
    	}
    	
    	function getActiveStandard(id){
    		vm.form = {};
    		vm.form.classYear = '';
    		vm.form.section = '';
    		
    		standardService.getActiveStandard({id:id}, successCb, errorCb);
			function successCb(result){
				if(result !="" && result !=undefined) {
    				vm.classYear = result.entityList;
    			}
			}
			function errorCb(error){
				$log.debug("FAILURE:",error)
			}
    	
    	}
    	
    	function getSection(){
    		vm.form.section = undefined;
    		var id = vm.form.classYear;
    		sectionService.getsectionByClassYearIdIsRestrict({id:id}, successCb, errorCb);
			function successCb(result){
				$log.debug("SUCCESS:",result)
				vm.sectionList = result;
			}
			function errorCb(error){
				$log.debug("FAILURE:",error)
			}
    	}
    	
    	vm.getSubjectByClassId = function (classYearId,sectionId) {
			subjectService.getsubjectByClassYearAndSectionAndStaff({classYearId,sectionId}, successCb, errorCb);
			function successCb(result) {
				vm.subjectList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getSubjectBySemesterId:",error)
			}
		};
		
		vm.getElectiveSubject = function(id) {
			delete vm.form.subjectElective;
            subjectService.getElectiveSubjectBySubjectId({id},successCb,errorCb);
            function successCb(result) {
                vm.electiveSubjectList = result;
            }
            function errorCb(error) {
                $log.debug("FAILURE getElectiveSubject:",error)
            }
		}
		
		vm.getSubmittedHomeworkByClassAndSubject = function() {
			vm.searchValues = [];
			if (vm.instituteType == "College") {
                vm.searchValues.push(vm.form.department);
			}
            vm.searchValues.push(vm.form.classYear);
            vm.searchValues.push(vm.form.section);
            vm.searchValues.push(vm.form.subject);
			if (vm.form.subjectElective) {
                vm.searchValues.push(vm.form.subjectElective);
			}
			if(vm.searchValues.length > 0) {
				initDataTable(vm.searchValues);
			}
		}
		
		$scope.viewSubmittedHomeWork = function (type) {
			setTimeout(function(){ getValue(type); }, 0);
		}
		
		function getValue(type) {
			var data ={};
			if(type == 'view') {
				var table = $('#StudentHomeWorkTable').dataTable();
				$(".selected", table.fnGetNodes()).each(function() {
					data = table.fnGetData($(this).parents())
					$(this).removeClass('selected');
				});
				data.institute = vm.instituteType;
				data.today = Date.now();
                vm.initData = data;
				if(data.institute == "College")
                    $("#studentAssignmentBtn").click();
				else
                    $("#studentHomeWorkBtn").click();
			}
		}

        vm.saveOrUpdateSubmittedHomeWork = function(data) {
            studentHomeworkService.updateStatus(data, successCb, errorCb);
            function successCb(result) {
                initDataTable(vm.searchValues);
                $log.debug("SUCCESS saveOrUpdateSubmittedHomeWork:",result)
            }
            function errorCb(error) {
                $log.debug("FAILURE saveOrUpdateSubmittedHomeWork:",error)
            }
        };

        function getDepartmentByRole() {
            departmentService.getDepartmentByRole(successCb, errorCb);
            function successCb(result) {
                vm.departments = result.entityList;
            }
            function errorCb(error) {
                $log.debug("FAILURE getDepartmentByRole:",error)
            }
        }

        function getClassYearByRole() {
            standardService.getClassYearByRole(successCb, errorCb);
            function successCb(result) {
                vm.classYear = result.entityList;
            }
            function errorCb(error) {
                $log.debug("FAILURE getClassYearByRole:",error)
            }
        }

		function initDataTable(searchValues) {
			vm.showTable=false
			studentHomeworkService.initTable('StudentHomeWorkTable', searchValues);
			$(".dataTables_scrollBody").mCustomScrollbar({theme:"dark-3", axis:"x"});
		}
		
    	function openNav() {
			document.getElementById("mySidenav").style.width = "240px";
		    document.getElementById("main").style.marginLeft = "250px";
		};
		
		function closeNav() {
		    document.getElementById("mySidenav").style.width = "0";
		    document.getElementById("main").style.marginLeft= "0";
	   };
    }
    })();