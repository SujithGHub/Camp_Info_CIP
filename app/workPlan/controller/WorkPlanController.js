(function() {
    'use strict';

    /**
     * 
     */
    angular
    .module('cip.workPlan')
    .controller('WorkPlanController', WorkPlanController);

    WorkPlanController.$inject = ['$log', 'WorkPlanService','SharedService','StandardService', 'AcademicService', 
        'DepartmentService', 'SectionService', 'SubjectService', 'CommonService', '$mdDialog', '$scope', '$state', 'SubjectAllotmentService'];

    /* @ngInject */
    function WorkPlanController($log, workPlanService, sharedService, standardService, academicService, departmentService, sectionService, subjectService, 
            commonService, $mdDialog, $scope, $state, subjectAllotmentService) {

        var vm = this;
        vm.init = init;
        vm.mScope = [];
        vm.initWorkPlanDataTable = initWorkPlanDataTable;
        vm.mScope.getClassByDepartmentId = getClassByDepartmentId;
        vm.mScope.getSectionByStandardId = getSectionByStandardId;
        vm.mScope.getsectionByClassYearIdIsRestrict = getsectionByClassYearIdIsRestrict;
        vm.mScope.getSemesterByClassYear = getSemesterByClassYear;
        vm.mScope.getAllottedSubjectbyStaff = getAllottedSubjectbyStaff;
        vm.saveOrUpdateWorkPlan = saveOrUpdateWorkPlan;
        vm.UpdateDailyWorkPlan = UpdateDailyWorkPlan;
        vm.mScope.removeWorkPlanDetail = removeWorkPlanDetail; 

        function init() {

            vm.mScope.instituteType = sharedService.institute.instituteType;
            getAcademic();
            if(vm.mScope.instituteType == 'College') {
            	getActiveRestrictedDepartmentList();
            	getActiveDepartmentList();
            } else {
                getYearAndStandard();
            }
        }

        function initWorkPlanDataTable() {
            workPlanService.initDataTable('workPlanDataTable');
        };

        vm.getDailyPlanListByStaff = function(data) {
            var data = {};
            data.academic = vm.form.academic;
            data.department = vm.form.department;
            data.classYear = vm.form.classYear;
            data.semester = vm.form.semester;
            data.section = vm.form.section;
            data.planDate = vm.form.planDate;
            data.subject = vm.form.subject;
            if(vm.form.electiveSubject) {
                data.electiveSubject = vm.form.electiveSubject;
            }
            workPlanService.initDataTable('dailyPlanDetailDataTable', data);
            vm.showExportBtn = true;
        }
        
        vm.getWorkPlanReport  =  function (data){
        	workPlanService.getWorkPlanReport(data, successCb, errorCb);
        	function successCb(result) {
                formChart(result);
            }
            function errorCb(error) {
                $log.debug("FAILURE getWorkPlanReport:",error);
            }
        }
        
     	var chart1 ;
    	var UNDEFINED;
    	function getReport(jsonArr){
    		Highcharts.setOptions({
    			lang: {
    				drillUpText: 'Back'
    			}
    		});
              
    		var options = {
    				chart: {
    					events: {
    						drilldown: function (e) {
    						},
    						drillup: function (e) {
    							//generateDrillDownJSON(e, true);
    						}
    					}
    				},
    				title: {
    					text: 'WorkPlan Report',
    					style: {
							color: '#000',
							fontWeight: 500,
							fontSize: '14px',
							fontFamily: 'roboto',
						},
    				},
    				xAxis: {
    					categories: true,
    					title: {
    						text: 'Subject Name',
    						style: {
    							color: '#000',
    							fontWeight: 500,
    							fontSize: '14px',
    							fontFamily: 'roboto',
    						},
    					},
    				},
    				yAxis: {
    					title: {
    						text: 'Total Percentage (%)',
    						style: {
    							color: '#000',
    							fontWeight: 500,
    							fontSize: '14px',
    							fontFamily: 'roboto',
    						},
    					}, 
    					max: 100,
    				},
    				legend: {
    					enabled: false
    				},
    				
    				tooltip: {
    			            pointFormat:'PendingPlan : <b>{point.pendingPlan}%</b>'
    			        },
    				
    				plotOptions: {
    					series: {
    						pointWidth:35,
    						pointPadding: 0, 
    						groupPadding: 0.01,
    						dataLabels: {
    							borderWidth: 0,
    							enabled: true,
    							format: '{point.y}%'
    						},
    						shadow: false,
    						
    					}
    				},
    				series: [{
    					name: '',
    					data: jsonArr,
    				}],
    		};
             
    		$("#chart_card").show();
    		$("#container").show();
    		// Drill Down Chart Implementation 
    		options.chart.renderTo = 'container';
    		options.chart.type = 'column';
    		options.color = 'red';
    		chart1 = new Highcharts.Chart(options, function(chart){
    			$.each(chart.series[0].data,function(i,data){
                    if(data.pendingPlan >= 50) {
                    	data.update({color:'red'});
                    } else if(data.pendingPlan < 50) {
                    	data.update({color:'orange'});
                    } else {
                    	data.update({color:'green'});
                    }
                       
                });
        });
    		$(".chart-content").mCustomScrollbar({theme:"dark-3", axis:"x"});
    	}
        
      	var workPlanReportArray = [];
    	function formChart(data){
    		var jsonArr = [];
    		var workPlanReportData=data;
    		var activeData = 0;
    		var count = 0;
    		if (Object.getOwnPropertyNames(data).length <= 0) {
    			$("#chart_card").show();
    			$("#container").show();
    			$("#container").html("<br><br><br><br><center><h4>No Record Found</h4></center>");
    		}
    		for (var i=0;i<workPlanReportData.length;i++) {
    			count++;
    			if(workPlanReportData[i] != 0) {
    				workPlanReportArray.push(i);
    				jsonArr.push({
    					name: workPlanReportData[i].subjectName,
    					y: workPlanReportData[i].total ,
    					pendingPlan: workPlanReportData[i].pendingPlan,
    					
    				});
    			}else {
    				activeData++;
    				jsonArr.push({
    					name: workPlanReportData[i].subjectName,
    				});
    			}
    			
    			if(workPlanReportData.length == count) {
    				if(workPlanReportData.length == activeData) {
    					$("#chart_card").show();
    					$("#container").show();
    					$("#container").html("<br><br><br><br><center><h4>No Record Found</h4></center>");
    				} else {
    					getReport(jsonArr);
    				}
    			}
    		}
    	}

        // Get standard list if institute type is school
        function getYearAndStandard() {
            standardService.getActiveStandard(successCb, errorCb);
            function successCb(result) {
                vm.mScope.yearAndStandardList = result.entityList;
            }
            function errorCb(error) {
                $log.debug("FAILURE getActiveYearAndStandard:",error);
            }
        }

        function getAcademic() {
            academicService.getAcademic(successCb, errorCb);
            function successCb(result) {
                vm.mScope.academicList = result.entityList;
            }
            function errorCb(error) {
                $log.debug("FAILURE getAcademic:",error);
            }
        }

        // Get active restricted department list if institute type as college
        function getActiveRestrictedDepartmentList() {
            departmentService.getActiveDepartmentIsRestrict(successCb, errorCb);
            function successCb(result) {
                vm.mScope.departmentList = result.entityList;
            }
            function errorCb(error) {
                $log.debug("FAILURE getActiveDepartmentList:",error);
            }
        }

     // Get active department list if institute type as college
        function getActiveDepartmentList() {
        	departmentService.getActiveDepartment(successCb, errorCb);
            function successCb(result) {
                vm.mScope.departments = result.entityList;
            }
            function errorCb(error) {
                $log.debug("FAILURE getActiveDepartmentList:",error);
            }
        }
        
        // Get active restricted class year list by deparment id
        function getClassByDepartmentId(id) {
            standardService.getClassYearByDepartmentIdIsRestrict({id}, successCb, errorCb);
            function successCb(result) {
                vm.mScope.yearAndStandardList = result;
            }
            function errorCb(error) {
                $log.debug("FAILURE getClassByDepartmentId:",error);
            }
        }
        
        // Get active class year list by deparment id
        function getClassByDepartmentId(id) {
        	standardService.getClassByDepartmentId({id}, successCb, errorCb);
			function successCb(result) {
				vm.mScope.yearAndStandardList = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getClassByDepartmentId:",error);
			}
		}

        // Get restricted section list by class year id
        function getsectionByClassYearIdIsRestrict(id) {
            sectionService.getsectionByClassYearIdIsRestrict({id},successCb, errorCb);
            function successCb(result) {
                vm.mScope.sectionList = result;
            }
            function errorCb(error) {
                $log.debug("FAILURE getSectionById:",error);
            }
        };

        // Get section list by class year id
        function getSectionByStandardId(id) {
        	sectionService.getSectionByStandardId({id},successCb, errorCb);
			function successCb(result) {
				vm.mScope.sections = result.entityList;
			}
			function errorCb(error) {
				$log.debug("FAILURE getSectionById:",error);
			}
		};
        
        // Get semester by class year 
        function getSemesterByClassYear(id) {
            for(var i=0; i<vm.mScope.yearAndStandardList.length;i++) {
                if(vm.mScope.yearAndStandardList[i].id==id) {
                    vm.mScope.semestersLists=commonService.getSemesterByClassYear(vm.mScope.yearAndStandardList[i].name);
                    i+=vm.mScope.yearAndStandardList.length-i;
                }
            }
        };

        function UpdateDailyWorkPlan(data) {
            workPlanService.updateDailyPlan(data.workPlanDetail, successCb, errorCb);
            function successCb(result) {
                vm.getDailyPlanListByStaff();
            }
            function errorCb(error) {
                $log.debug("FAILURE getSubjectBySemesterId:",error)
            }
        }

        function getAllottedSubjectbyStaff(semester, section) {
            subjectAllotmentService.getAllottedSubjectbyStaff({semester, section}, successCb, errorCb);
            function successCb(result) {
                vm.mScope.subjectList = result;
            }
            function errorCb(error) {
                $log.debug("FAILURE getSubjectBySemesterId:",error)
            }
        };
        
        vm.mScope.getSubjectElectiveBySubjectId = function(subjectId) {
            vm.mScope.subjectElectives=[];
            for(var i = 0; i< vm.mScope.subjectList.length; i++) {
                if(vm.mScope.subjectList[i].subject.isElective && vm.mScope.subjectList[i].subject.id == subjectId) {
                    vm.mScope.isElective = vm.mScope.subjectList[i].subject.isElective;
                    vm.mScope.subjectElectives.push(vm.mScope.subjectList[i].subjectElective);
                }
            }
        }

        function saveOrUpdateWorkPlan(data) {
            if(data.id) {
                data.planDate = commonService.convertDateFormat(data.planDate);
                for(var i = 0; i<data.workPlanDetail.length; i++) {
                    data.workPlanDetail[i].expectedDate = commonService.convertDateFormat(data.workPlanDetail[i].expectedDate);
                }
                workPlanService.updateWorkPlan(data,successCb, errorCb);
            } else {
                vm.planNotes = [];
                for (var i=0;i<data.workPlanDetail.length;i++) {
                    vm.checkDuplicate(data.workPlanDetail[i]);
                }
                workPlanService.saveWorkPlan(vm.planNotes,successCb, errorCb);
            }
            function successCb(result) {
                initWorkPlanDataTable();
            }
            function errorCb(error) {
                $log.debug("FAILURE saveOrUpdateWorkPlan:",error);
            }

        }
        
        vm.checkDuplicate = function(data) {
            if(vm.planNotes.length>0){
                for(var j = 0; j < vm.planNotes.length; j++) {
                    var obj = vm.planNotes.filter(function ( obj ) {
                        return obj.planDate === data.expectedDate;
                    })[0];
                    if(obj && obj.planDate) {
                        obj.workPlanDetail.push(data)
                    } else {
                        vm.bindWorkPlantData(data);
                    }
                    j = vm.planNotes.length+1;
                }
            } else {
                vm.bindWorkPlantData(data);
            }
        }    
        
        vm.bindWorkPlantData = function(data) {
            vm.planNotes.push({});
            vm.planNotes[vm.planNotes.length-1].academic = vm.mScope.mForm.academic;
            vm.planNotes[vm.planNotes.length-1].department = vm.mScope.mForm.department;
            vm.planNotes[vm.planNotes.length-1].classYear = vm.mScope.mForm.classYear;
            vm.planNotes[vm.planNotes.length-1].semester = vm.mScope.mForm.semester;
            vm.planNotes[vm.planNotes.length-1].section = vm.mScope.mForm.section;
            vm.planNotes[vm.planNotes.length-1].subject = vm.mScope.mForm.subject;
            if(vm.mScope.mForm.subjectElective && vm.mScope.mForm.subjectElective.id) {
                vm.planNotes[vm.planNotes.length-1].subjectElective = vm.mScope.mForm.subjectElective;
            }
            vm.planNotes[vm.planNotes.length-1].planDate = data.expectedDate;
            vm.planNotes[vm.planNotes.length-1].workPlanDetail = [];
            vm.planNotes[vm.planNotes.length-1].workPlanDetail.push(data);
        }

        $scope.updateWorkPlanDetail = function(type) {
            setTimeout(function(){ getValue(type, "#workPlanDataTable"); }, 0);
        };

        $scope.updateDailyPlanDetail = function(type) {
            setTimeout(function(){ getValue(type, "#dailyPlanDetailDataTable"); }, 0);
        };

        function getValue(type, tableName) {
            var data ={};
            var table = $(tableName).dataTable();
            $(".selected", table.fnGetNodes()).each(function() {
                data = table.fnGetData($(this).parents());
                $(this).removeClass('selected');
            });
            if(type == "update") {
                getSectionByStandardId(data.classYear.id)
                getAllottedSubjectbyStaff(data.semester, data.section.id)
                vm.mScope.semestersLists=commonService.getSemesterByClassYear(data.classYear.name);
                data.planDate = commonService.convertDatePickerFormat(data.planDate);
                for(var i = 0; i<data.workPlanDetail.length; i++) {
                    data.workPlanDetail[i].expectedDate = commonService.convertDatePickerFormat(data.workPlanDetail[i].expectedDate);
                }
                vm.initData = data;
                commonService.triggerModelForm();
            } else if(type == "plandetail") {
                vm.initData = data;
                vm.getPendingWorkPlanByDate(data);
                $scope.$broadcast('modelForm');
            } else {
                vm.deleteStudent(data);
            }
        }

        vm.getPendingWorkPlanByDate = function(data) {
            vm.form.planDate = commonService.convertDateFormat(data.planDate);
            workPlanService.getPendingWorkPlanListByDate(vm.form,successCb, errorCb);
            function successCb(result) {
                for (var i = 0; i< result.length; i++) {
                    vm.mScope.mForm.workPlanDetail.push(result[i]);
                }
            }
            function errorCb(error) {
                $log.debug("FAILURE getPendingWorkPlanByDate:",error);
            }
        }

        vm.downloadWorkPlanExcel = function() {

            var data = {};
            data.academic = vm.form.academic;
            data.department = vm.form.department;
            data.classYear = vm.form.classYear;
            data.semester = vm.form.semester;
            data.section = vm.form.section;
            data.planDate = vm.form.planDate;
            data.subject = vm.form.subject;
            if(vm.form.electiveSubject) {
                data.electiveSubject = vm.form.electiveSubject;
            }
            workPlanService.downloadWorkPlanExcel(data, successCb, errorCb)
            function successCb(result) {
                var html = '<table id="resultTable">'+
                '<thead><tr><th>S.No</th><th>Attendance Hour</th><th>Description</th><th>Completed Date</th></tr></thead><tbody>';
                var k=0;
                for(var i=0;i<result.entityList.length;i++) {
                    for(var j=0;j<result.entityList[i].workPlanDetail.length;j++) {
                            if(result.entityList[i].workPlanDetail[j].status=="CLOSED") {
                                html += '<tr><td>'+(k+= 1)+'</td>';
                                html += '<td>'+result.entityList[i].workPlanDetail[j].hour+'</td>';
                                html += '<td>'+result.entityList[i].workPlanDetail[j].planNotes+'</td>';
                                html += '<td>'+result.entityList[i].workPlanDetail[j].completionDate+'</td>';
                        }
                    }
                    html +='</tr>';
                }
                html += '</tbody></table>';
                $('#htmlContent').html(html);
                $('#htmlContent').show();
                $('#resultTable').tableExport({type:'excel',escape:false,fileName:'Work Plan'});
                $('#htmlContent').hide();
            }

            function errorCb(error) {
                $log.debug("FAILURE getSectionById:",error);
            }
        }
        
        function removeWorkPlanDetail(index) {
            vm.mScope.mForm.workPlanDetail.splice(index,1);
        }
    }
})();