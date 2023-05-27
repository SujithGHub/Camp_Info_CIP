(function() {
    'use strict';
    /**
     * @author Deepa
     */
    angular
        .module('cip.attendanceAnalysis')
        .controller('AttendanceAnalysisController', AttendanceAnalysisController);

    AttendanceAnalysisController.$inject = ['$log', '$http', 'CommonService', '$scope', 'AttendanceAnalysisService', 'ngTableParams', 'SharedService', '$rootScope', 'SharedService', 'SectionService','StandardService', 'DepartmentService', 'SystemService'];

    /* @ngInject */
    function AttendanceAnalysisController($log, $http, commonService, $scope, attendanceAnalysisService, ngTableParams, SharedService, $rootScope, sharedService, SectionService, standardService, departmentService, systemService) {
    	
    	var vm = this;
    	vm.init 				= init;
    	vm.getClass 		    = getClass;
    	vm.getSection			= getSection;
    	vm.getSearchResult		= getSearchResult;
    	vm.getReportPage		= getReportPage;
    	vm.form = {};
		vm.baseApi              = commonService.baseApi;
    	
    	var userDetails = sharedService.userDetails;
    	vm.institute = sharedService.institute;
    	vm.instituteType = sessionStorage.getItem('instituteType');
    	vm.role = sessionStorage.getItem('role');

    	function init() {

    		if(vm.role != 'ROLE_USER') {
    			getList(vm.instituteType);
    		}

    		if(vm.instituteType == "School") {
    			xAxisTitle = "Class"
    		}else if(vm.instituteType == "College"){
    			if (vm.role == 'ROLE_STAFF_HOD') {
                    getActiveHodDepartment();
				}
    			xAxisTitle = "Department"
    		}
    	}

    	function getActiveHodDepartment() {
            if(vm.role == "ROLE_STAFF_HOD") {
                systemService.getUser(successCb, errorCb);
                function successCb(result) {
                    vm.form.department = result.entity.staff.department.id;
                    getClass(vm.form.department);
                }
                function errorCb(error) {
                    $log.debug("FAILURE getUser:",error)
                }
            }
        }

    	var xAxisTitle;

    	function getList(type){
    		if(type == "College") {
    			departmentService.getActiveDepartment(successCb, errorCb);
    			function successCb(result){
    				vm.departments = result.entityList;
    			}
    			function errorCb(error){
    				$log.debug("FAILURE:",error)
    			}

    		}else {

    			attendanceAnalysisService.getClassList(successCb, errorCb);
    			function successCb(result){
    				$log.debug("SUCCESS:",result)
    				vm.classYear = result.entityList;
    			}
    			function errorCb(error){
    				$log.debug("FAILURE:",error)
    			}

    		}
    	}

    	function getClass(id){
    		vm.form.classYear = undefined;
    		vm.form.section = undefined;
    		
    		standardService.getClassByDepartmentId({id:id}, successCb, errorCb);
			function successCb(result){
				$log.debug("SUCCESS:",result)
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
    		
    		SectionService.getSectionByStandardId({id:id}, successCb, errorCb);
			function successCb(result){
				$log.debug("SUCCESS:",result)
				vm.sectionList = result.entityList;
			}
			function errorCb(error){
				$log.debug("FAILURE:",error)
			}
    	}

    	var chart1 ;
    	var myJSON = [];
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
    					text: ''
    				},

    				xAxis: {
    					categories: true,
    					title: {
    						text: xAxisTitle,
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
    						text: 'Percentage (%)',
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
    						point: {
    							events: {
    								click: function() {
    									if(this.x != UNDEFINED)
    										if(this.name != null) {
    											generateGridData(this);
    										}
    								}	
    							}
    						}
    					}
    				},
    				colors: ['#4885ed','#db3236','#f4c20d','#3cba54','#A52A2A','#808080'],
    				series: [{
    					name: '',
    					colorByPoint: true,
    					data: jsonArr
    				}],
    		};
    		$("#student").hide();
    		$("#chart_card").show();

    		$("#container").show();
    		$("#nameDiv").hide();
    		$("#table").hide();
    		// Drill Down Chart Implementation 
    		options.chart.renderTo = 'container';
    		options.chart.type = 'column';
    		chart1 = new Highcharts.Chart(options);
    		$(".chart-content").mCustomScrollbar({theme:"dark-3", axis:"x"});
    	}


    	function getHourCount(){
    		vm.hourCount;
    		if(vm.institute.attendanceType == 'session') {
    			vm.hourCount = 2;
    			vm.attendanceLabel = 'Sessions'
    		}else if(vm.institute.attendanceType == 'day') {
    			vm.hourCount = 1;
    			vm.attendanceLabel = 'Days'
    		}else if(vm.institute.attendanceType == 'hours') {
    			vm.hourCount = vm.institute.hoursCount;
    			vm.attendanceLabel = 'Hours'
    		}
    		return vm.hourCount;
    	}

    	var start = 0;
    	var limit = 10;
    	var pageNumber = 1;

    	function formGrid(data,searchDetails){
    		vm.totalDays = data[0];
    		vm.daysPresent = data[1];
    		vm.daysAbsent = data[0]-data[1];
    		getHourCount();
    		$scope.totalCount = 0;

    		$scope.tableData = new ngTableParams({
    			page: 1,   // show current page
    			count: 10           // count per page
    		}, {
    			total: $scope.totalCount , // length of data
    			getData: function ($defer, params) {
    				start = (params.page() - 1) * params.count();
    				pageNumber = params.page();
    				$http.get( commonService.baseApi+'/attendance/rollno?searchInfo='+searchDetails+'&start='+start+'&limit='+limit)
    				.success(function (data, status, headers, config) {
						if(data.entityList.length>0) {
    					$scope.resultList = data.entityList;
    					$scope.studentName = $scope.resultList[0].student.firstName;
    					$scope.totalCount = data.totalCount;
						}
						$defer.resolve($scope.resultList);
    					params.total($scope.totalCount);
    				});
    			}
    		});
    		$("#container").hide();
    		$("#student").show();
    		$("#chart_card").hide();
    		$("#nameDiv").show();
    		$("#table").show();
    		//}

    	}

    	var deptArr = [];
    	function formChart(data){
    		var jsonArr = [];
    		var deptData=data;
    		var activeData = 0;
    		var count = 0;
    		if (Object.getOwnPropertyNames(data).length <= 0) {
    			$("#student").hide();
    			$("#chart_card").show();
    			$("#container").show();
    			$("#nameDiv").hide();
    			$("#table").hide();
    			$("#container").html("<br><br><br><br><center><h4>No Record Found</h4></center>");
    		}
    		for (var i in deptData) {
    			count++;
    			if(deptData[i] != 0) {
    				deptArr.push(i);
    				jsonArr.push({
    					name: i,
    					y: deptData[i],
    				});
    			}else {
    				activeData++;
    				jsonArr.push({
    					name: i,
    				});
    			}
    			if(Object.keys(data).length == count) {
    				if(Object.keys(data).length == activeData) {
    					$("#student").hide();
    					$("#chart_card").show();
    					$("#container").show();
    					$("#nameDiv").hide();
    					$("#table").hide();
    					$("#container").html("<br><br><br><br><center><h4>No Record Found</h4></center>");
    				} else {
    					getReport(jsonArr);
    				}
    			}
    		}
    	}

    	function getResultByRollNo(searchInfo) {
    		attendanceAnalysisService.getAttendanceDetails({searchInfo:searchInfo},successCb, errorCb);
    		function successCb(result){
    			$log.debug("SUCCESS:",result)
    			formGrid(result.entityList,searchInfo);
    		}
    		function errorCb(error){
    			$log.debug("FAILURE:",error)
    		}
    	}

    	function getSearchResult(form){
    		vm.rollNo = "";
    		if(form.searchRollNo && form.searchRollNo.originalObject) {
    			vm.rollNo =  form.searchRollNo.originalObject.rollNumber;
    		}
    		var searchInfo = [];
    		var fromDate = commonService.convertDateFormat(form.fromDate);
    		var toDate = commonService.convertDateFormat(form.toDate);
    		searchInfo.push(fromDate);
    		searchInfo.push(toDate);
			if(sessionStorage.getItem('role') == 'ROLE_USER') {
				searchInfo.push(sessionStorage.getItem('classYear'))
				searchInfo.push(sessionStorage.getItem('section'))
			} else {
			searchInfo.push(form.classYear)
			searchInfo.push(form.section)
			}
    	
    		if(form.department == "all" && !(vm.rollNo)) {
    			xAxisTitle = "Department";
    			$http.get( commonService.baseApi+'/attendance/all/department?searchInfo='+searchInfo)
    			.success(function (data, status, headers, config) {
    				formChart(data);
    			});
    		}else if(form.department && form.department != "all" && form.department != undefined  && !(vm.rollNo) && !(form.classYear) ) {
    			xAxisTitle = "Year";
    			searchInfo.push(form.department); 
    			$http.get( commonService.baseApi+'/attendance/department?searchInfo='+searchInfo)
    			.success(function (data, status, headers, config) {
    				formChart(data);
    			});
    		}else if(form.department != "all" && form.department != undefined && form.classYear != undefined && !(vm.rollNo) && form.classYear && form.department && (!form.section)) {
    			xAxisTitle = "Year";
    			searchInfo.push(form.department); 
    			searchInfo.push(form.classYear); 
    			$http.get( commonService.baseApi+'/attendance/class/search?searchInfo='+searchInfo)
    			.success(function (data, status, headers, config) {
    				formChart(data);
    			});
    		}else if(form.department != "all" && form.department != undefined && form.classYear != undefined && form.classYear && form.section != undefined && !(vm.rollNo)) {
    			xAxisTitle = "Section";
    			searchInfo.push(form.department); 
    			searchInfo.push(form.classYear); 
    			searchInfo.push(form.section); 
    			$http.get( commonService.baseApi+'/attendance/section/search?searchInfo='+searchInfo)
    			.success(function (data, status, headers, config) {
    				formChart(data);
    			});
    		}else if(form.classYear   && form.classYear != 'all' && !(vm.rollNo) && !(form.section)) {
    			xAxisTitle = "Standard";
    			searchInfo.push(form.classYear); 
    			$http.get( commonService.baseApi+'/attendance/class/search?searchInfo='+searchInfo)
    			.success(function (data, status, headers, config) {
    				formChart(data);
    			});
    		}else if(form.classYear && form.classYear == 'all'  && !(vm.rollNo) && !(form.section)) {
    			xAxisTitle = "Standard";
    			searchInfo.push(form.classYear); 
    			$http.get( commonService.baseApi+'/attendance/standard/search?searchInfo='+searchInfo)
    			.success(function (data, status, headers, config) {
    				formChart(data);
    			});
    		}else if(form.classYear != undefined && form.classYear && form.section != undefined && !(vm.rollNo)) {
    			xAxisTitle = "Section";
    			searchInfo.push(form.classYear); 
    			searchInfo.push(form.section); 
    			$http.get( commonService.baseApi+'/attendance/section/search?searchInfo='+searchInfo)
    			.success(function (data, status, headers, config) {
    				formChart(data);
    			});
    		}else if(vm.rollNo) {
    			searchInfo.push(vm.rollNo);
    			getResultByRollNo(searchInfo);

    		}else if(vm.role == 'ROLE_USER') {
    			searchInfo.push(userDetails.student.rollNumber);
    			getResultByRollNo(searchInfo);
    		}
    	}
    	
    	function getReportPage(){
    		if(vm.rollNo){
    			SharedService.setStdRollNo(vm.rollNo);
    		}else{
    			SharedService.setStdRollNo(vm.form.searchText.rollNumber);
    		}
    	}


    	if(SharedService.stdRollNo != null) {
    		$scope.reportStatus = SharedService.reportStatus;
    		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    		                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    		                  ];

    		var startDate = new Date(SharedService.academicYear.fromDate);
    		var fromDate = startDate.getDate()+"/"+(monthNames[startDate.getMonth()])+"/"+startDate.getFullYear(); 
    		var endDate = new Date(SharedService.academicYear.toDate);
    		var toDate = endDate.getDate()+"/"+(monthNames[endDate.getMonth()])+"/"+endDate.getFullYear();
    
    		if(vm.role != 'ROLE_USER') {
    			if(vm.instituteType == "College") {
    				getClass(SharedService.studentDetails.department.id);
    				vm.form.department = SharedService.studentDetails.department.id;

    			}

    			SectionService.getSectionByStandardId({id:SharedService.studentDetails.classYear.id}, successCb, errorCb);
    			function successCb(result){
    				$log.debug("SUCCESS:",result)
    				vm.sectionList = result.entityList;
    			}
    			function errorCb(error){
    				$log.debug("FAILURE:",error)
    			}
    			vm.form.classYear = SharedService.studentDetails.classYear.id;
    			vm.form.section = SharedService.studentDetails.section.id;
    		}
    		
    		vm.form.fromDate = fromDate;
    		vm.form.toDate = toDate;
    		vm.rollNo = SharedService.stdRollNo;
    		vm.form.searchText = { rollNumber : vm.rollNo, originalObject: {rollNumber : vm.rollNo }};
    		getSearchResult(vm.form);
    		SharedService.setStdRollNo(null);
    	}
    	
    }
	})();