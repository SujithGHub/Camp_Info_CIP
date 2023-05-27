(function() {
    'use strict';
    /**
     * @author Deepa
     */
    angular
        .module('cip.viewAttendance')
        .controller('ViewAttendanceController', ViewAttendanceController);

    ViewAttendanceController.$inject = ['$http','AttendanceReportService','$mdDialog','$log','ngTableParams','$scope','$timeout','SharedService','CommonService'];

    /* @ngInject */
    function  ViewAttendanceController($http,attendanceReportService,$mdDialog,$log,ngTableParams,$scope,$timeout,sharedService,commonService) {
    
    	var vm = this;
    	vm.init = init;
    	vm.showChart = showChart;


    	var userDetails = sharedService.userDetails;
    	vm.institute    = sharedService.institute;
    	vm.attendanceType = vm.institute.attendanceType;
    	var mainTitle = 'Academic Year : '+sharedService.currentAcademic;
    	var xAxisTitle;
    	var instituteType = sessionStorage.getItem('instituteType');
    	var deptArr = [];
    	var jsonArr = [];
    	
    	function getAttendanceReport(){
    		$http.get( commonService.baseApi+'/attendance/day/report?instituteType='+instituteType)
    		.success(function (data, status, headers, config) {
    			//form first level data(Department level) main data
    			var deptData=data[0];
    			
    			var activeData = 0;
    			var count = 0;
    			for (var i in deptData) {
    				count++;
    				if(deptData[i] != 0) {
    					deptArr.push(i);
    					jsonArr.push({
    						name: i,
    						y: deptData[i],
    						drilldown: i
    					});
    				}else {
    					activeData++;
    					jsonArr.push({
    						name: i,
    						//y: deptData[i]
    					});
    				}
    				if(Object.keys(data[0]).length == count) {
    					if(Object.keys(data[0]).length == activeData) {
    						$("#container").html("<br><br><br><br><center><h4 style='font-size:17px;'>No Record Found</h4></center>");
    					} else {
    						var drillArr = formDrillDown(data[1],data[2]);
    					}
    				}
    			}
    		});
    	}

    	/*if($rootScope.roles == 'ROLE_ADMIN' || 'ROLE_STAFF') {*/
    	function init() {

    		if(instituteType == "School") {
    			xAxisTitle = "Standard"
    		}else if(instituteType == "College"){
    			xAxisTitle = "Department"
    		}

    		getAttendanceReport();

    	}


    	function formDrillDown(data,sectionData){
    		var drillDownArr = [];
    		for (var i=0;i<deptArr.length;i++) {
    			var mainArr=[]; 
    			var count = 0;
    			for (var key in data) {
    				var yclass;
    				count++;
    				var result = key.split("$#")[0];
    				if(instituteType == "School") {
    					yclass = key.split("$#")[1];
    				}else {
    					yclass = key.split("$#")[0]+'~'+key.split("$#")[1];
    				}
    				if(result == deptArr[i]) {
    					var dataArr=[];
    					var sectionCount = 0;
    					var secArrs = [];
    					var drillcount =0;
    					for(var secKey in sectionData) {
    						sectionCount++;
    						var drillId;
    						if(secKey.split("$#")[0]+'~'+secKey.split("$#")[1] == yclass) {
    							var secArr = [];
    							drillcount++;
    							drillId = secKey.split("$#")[0]+'~'+secKey.split("$#")[1];
    							if(sectionData[secKey] == 0) {
    								secArr.push(secKey.split("$#")[2],"");
    							}else {
    								secArr.push(secKey.split("$#")[2],sectionData[secKey]);
    							}
    							secArrs.push(secArr);
    						}
    						//form third level data(section level)
    						if(Object.keys(sectionData).length == sectionCount &&  drillcount !=0) {
    							drillDownArr.push({
    								id: drillId,
    								name:  drillId,
    								data : secArrs
    							});
    						}

    					}
    				}
    				//form second level data(classyear level)
    				if(result == deptArr[i]) {
    					var dataArr=[];
    					if(instituteType == "School") {
    						if(data[key] != 0) {
    							mainArr.push({
    								name: yclass,
    								y:   data[key]
    							});
    						}else {
    							mainArr.push({
    								name: yclass,
    								//	y:   data[key]
    							});
    						}
    					}else {
    						if(data[key] == 0) {
    							mainArr.push({
    								name: yclass,
    								//y:   data[key]
    							});
    						}else {
    							mainArr.push({
    								name: yclass,
    								y:   data[key],
    								drilldown : yclass
    							});
    						}
    					}
    				}
    				//form final drill down data
    				if(Object.keys(data).length == count) {
    					drillDownArr.push({
    						name: deptArr[i],
    						id: deptArr[i],
    						data:mainArr
    					});
    				}
    			}
    		}
    		getReport(jsonArr,drillDownArr);
    	}

    	var chart1 ;
    	var myJSON = [];
    	var UNDEFINED;
    	function getReport(jsonArr,drillArr){
    		// Internationalization
    		Highcharts.setOptions({
    			lang: {
    				drillUpText: ' Back '
    			}
    		});

    		var options = {
    				chart: {
    					events: {
    						drilldown: function (e) {
    							generateDrillDownJSON(e, false);
    						},
    						drillup: function (e) {
    							generateDrillDownJSON(e, true);
    							$("#table").hide();
    						}
    					}
    				},

    				title: {
    					text: mainTitle,
    					align: 'left',
    					margin: 55,
    					x: 25,
    					// y: 2,
    					style: {
    						color: '#5e5e5e',
    						fontWeight: 400,
    						fontSize: '14px',
    						fontFamily: 'roboto',

    					},
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
    					/*labels: {
    		                rotation: -45
    		            }*/
    				},
    				yAxis: {
    					//max: 100,
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
    				drilldown: {
    					drillUpButton: {
    						relativeTo: 'spacingBox',
    						position: {
    							y: 0,
    							x: 0
    						},
    						theme: {
    							fill: '#9a9a9a',
    							stroke: '#9a9a9a',
    							states: {
    								hover: {
    									fill: '#9a9a9a'
    								},
    								select: {
    									stroke: '#9a9a9a',
    									fill: '#9a9a9a'
    								}
    							}
    						}

    					},
    					series: drillArr
    				},

    				legend: {
    					enabled: false
    				},

    				plotOptions: {
    					series: {
    						pointWidth: 35,
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

    		// Drill Down Chart Implementation 
    		options.chart.renderTo = 'container';
    		options.chart.type = 'column';
    		chart1 = new Highcharts.Chart(options);
    		$(".chart-content").mCustomScrollbar({theme:"dark-3", axis:"x"});
    	}

    	function getHourCount(){
    		vm.hourCount;
    		if(vm.attendanceType == 'session') {
    			vm.hourCount = 2;
    		}else if(vm.attendanceType == 'day') {
    			vm.hourCount = 1;
    		}else if(vm.attendanceType == 'hours') {
    			vm.hourCount = vm.institute.hoursCount;
    		}/*else if(vm.attendanceType == '8 Hours') {
    			vm.hourCount = 8;
    		}else if(vm.attendanceType == '7 Hours') {
    			vm.hourCount = 7;
    		}else if(vm.attendanceType == '6 Hours') {
    			vm.	hourCount = 6;
    		}else if(vm.attendanceType == '5 Hours') {
    			vm.	hourCount = 5;
    		}else if(vm.attendanceType == '4 Hours') {
    			vm.hourCount = 4;
    		}*/
    		return vm.hourCount;
    	}

    	//current date student attendance Detail
    	function formGrid(studentData){

    		getHourCount();

    		$scope.dataLength = studentData.length;
    		$scope.tableData = new ngTableParams({
    			page: 1,            // show first page
    			count: 10           // count per page
    		}, {
    			total: studentData.length, // length of data
    			getData: function ($defer, params) {
    				$defer.resolve(studentData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    			}
    		});
    		$("#student").show("fast");
    		$("#table").show();
    		$("#container").slideUp("slow");
    		$("#showButton").show();
    	}

    	function getStudentList(status) {
    		$http.get( commonService.baseApi+'/attendance/currentdate/section?status='+status)
    		.success(function (data, status, headers, config) {
    			if(data.length != 0) {
    				formGrid(data.entityList);
    			}
    		});
    	}

    	function generateGridData(currentDiv) {
    		$("#table").hide();
    		var status = [];
    		var section;
    		var statusInfo;
    		if(instituteType == "School") {
    			section = currentDiv.name;
    			if(myJSON[0] != undefined) {
    				status.push(myJSON[0].name);
    			}
    			status.push(section);
    			if(myJSON.length>0) {
    				getStudentList(status);
    			}
    		}else {
    			if(myJSON[1] != undefined) {
    				section = currentDiv.name;
    				statusInfo = myJSON[1].name+"~"+section;
    				status.push(statusInfo.split("~")[1]);
    				status.push(statusInfo.split("~")[2]);
    				status.push(statusInfo.split("~")[0]);
    				if(myJSON.length>1) {
    					getStudentList(status);
    				}
    			}
    		}

    	}

    	function generateDrillDownJSON(e, isDrillUp) {
    		try {
    			if (isDrillUp) {
    				if (myJSON != null && myJSON.length > 0) {
    					removeArrayElementByIndex(myJSON, myJSON.length - 1);
    				}
    				sessionStorage.setItem('DrillDownJSON', JSON.stringify(myJSON));
    				$("#jsonContent").html('JSON content is: ').append(JSON.stringify(myJSON));
    				if(instituteType == "College") {
    					if(myJSON.length == 1) {
    						chart1.xAxis[0].setTitle({text:'Year'});
    					}else if(myJSON.length == 0) {
    						chart1.xAxis[0].setTitle({text:'Department'});
    					}
    				} else {
    					chart1.xAxis[0].setTitle({text:'Standard'});
    				}
    			} else {
    				//chart1.xAxis[0].setTitle({text:'class'});
    				if(instituteType == "College") {
    					if(myJSON.length == 0) {
    						chart1.xAxis[0].setTitle({text:'Year'});
    					}else if(myJSON.length == 1) {
    						chart1.xAxis[0].setTitle({text:'Section'});
    					}
    				} else {
    					chart1.xAxis[0].setTitle({text:'Section'});
    				}
    				myJSON.push({
    					name: e.point.name,
    					level: myJSON.length + 1,
    				});
    				sessionStorage.setItem('DrillDownJSON', JSON.stringify(myJSON));
    				$("#jsonContent").html('JSON content is: ').append(JSON.stringify(myJSON));
    			}

    		} catch (e) {
    		}
    	}

    	function removeArrayElementByIndex(myArray, index) {
    		myArray.splice(index, 1);
    	}

    	function showChart(){
    		$("#student").slideDown("fast");
    		$timeout(function () {
    			$("#showButton").hide();
    			$("#student").hide();
    			$("#table").hide();
    			$("#container").slideDown("slow");
    		},200);
    	}

    	//Resizes chart when opening side menu
    	var chartResize = angular.element('#container');
    	chartResize.bind('resize', function () {
    		$('#container').highcharts().reflow();
    	});
    }
})();