(function() {
    'use strict';
    /**
     * @author Deepa
     */
    angular
        .module('cip.attendanceReport')
        .controller('AttendanceReportController', AttendanceReportController);

    AttendanceReportController.$inject = ['$http','AttendanceReportService','$mdDialog','$log','$scope','ngTableParams','$timeout','SharedService','CommonService'];

    /* @ngInject */
    function  AttendanceReportController($http,attendanceReportService,$mdDialog,$log,$scope,ngTableParams,$timeout,sharedService,commonService) {
    	
    	var vm = this;
    	vm.init = init;
    	vm.showChart = showChart;
    	
    	var studentData = [];
    	var jsonArr = [];
    	var drillDownArr = [];
    	var deptArr = [];
    	var xAxisTitle;
    	var mainTitle = 'Academic Year : '+sharedService.currentAcademic;
    	var userDetails = sharedService.userDetails;
    	var instituteType = sessionStorage.getItem('instituteType');
    	var role = sessionStorage.getItem('role');
    	var overallPercentage;


    	function formDrillDown(data,sectionData){
    		for (var i=0;i<deptArr.length;i++) {
    			var mainArr=[]; 
    			var count = 0;
    			for (var key in data) {
    				count++;
    				var result = key.split("$#")[0];
    				var yclass;
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
    							//secArr.push(secKey.split("$#")[2],sectionData[secKey]);
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

    	function getAttendanceReport() {
    		$http.get( commonService.baseApi+'/attendance/report?instituteType='+instituteType)
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

    	//Get Student Attendance
    	function getStudentAttendance(){
    		$http.get( commonService.baseApi+'/attendance/monthwise/report')
    		.success(function (data, status, headers, config) {
    			var monthlyPercentage=data;
    			var activeData = 0;
    			//var count = 0;
    			for (var i in monthlyPercentage) {
    				//	count++;
    				if(monthlyPercentage[i] != 0) {
    					deptArr.push(i);
    					jsonArr.push({
    						name: i.toUpperCase(),
    						y: monthlyPercentage[i],
    						drilldown: i
    					});
    				}else {
    					activeData++;
    					jsonArr.push({
    						name: i.toUpperCase(),
    						//	y: monthlyPercentage[i]
    					});
    				}
    			}

    			if(activeData == 12) {
    				$("#container").html("<br><br><br><br><center><h4 style='font-size:17px;'>No Record Found</h4></center>");
    			} else {
    				var drillArr = getStudentReport(jsonArr,drillArr);
    			}
    		});
    	}


    	function init() {

    		if(role == 'ROLE_USER') {

    			var rollNo = userDetails.student.rollNumber
    			attendanceReportService.getAttendancePercentage({rollNo}, successCb, errorCb);
    			
    			function successCb(result){
    				console.log(result)
    				overallPercentage = 'Attendance Percentage : '+result.totalCount+'%';
    				if(result.totalCount != 0) {
    					getStudentAttendance();
    				}else {
    					$("#container").html("<br><br><br><br><center><h4 style='font-size:17px;'> No Record Found</h4></center>");
    				}
    			}
    			function errorCb(error){
    				$log.debug("FAILURE getAttendancePercentageByRollNo:",error)
    			}
    			/*		$http.get('/attendance/getAttendancePercentageByRollNo?rollNo='+rollNo)
    			.success(function (data, status, headers, config){
    				overallPercentage = 'Attendance-percentage : '+data.totalCount;
    				if(data.totalCount != 0) {
    					getStudentAttendance();
    				}else {
    					$("#container").html("<br><br><br><br><center><h4 style='font-size:17px;'> No Record Found</h4></center>");
    				}

    			});*/
    		}else {

    			if(instituteType == "School") {
    				xAxisTitle = "Standard"
    			}else if(instituteType == "College"){
    				xAxisTitle = "Department"
    			}
    			getAttendanceReport();

    		}

    	};


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
    					//	 y: 2,
    					style: {
    						color: '#5e5e5e',
    						fontWeight: 400,
    						fontSize: '14px',
    						fontFamily: 'roboto',

    					},
    				},
    				/*			subtitle: {
    					text: '',
    					align: 'center',
    					 y: 2,
    					style: {
    						color: '#5e5e5e',
    						fontWeight: 400,
    						fontSize: '14px',
    						fontFamily: 'roboto',

    					},
    				},*/
    				/*	subtitle: {
    					text: ,
    				},*/
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
    					/*		labels: {
    		                rotation: -45
    		            }*/
    				},
    				yAxis: {
    					title: {
    						text: 'Percentage (%)',
    						style: {
    							color: '#000',
    							fontWeight: 500,
    							fontSize: '14px',
    							fontFamily: 'roboto',
    						}

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
    							// 'stroke-width': 1,
    							stroke: '#9a9a9a',
    							//   color:'#0FFF',
    							//  r: 0,
    							states: {
    								hover: {
    									fill: '#9a9a9a'
    								},
    								select: {
    									stroke: '#9a9a9a',
    									fill: '#9a9a9a'
    								},text: {
    									color : 'white',
    									fill : 'white',
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
    							//	format: '{point.y:.1f}%'
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
    				/*			navigation: {
    		            buttons: {
    		                contextButton: {
    		                    symbol: 'circle',
    		                    symbolFill: 'blue'
    		                }
    		            }
    		        },*/
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

    	function formGrid(data){
    		studentData = data;
    		for(var i=0;i<studentData.entityList.length;i++) {
    			studentData.entityList[i][2] = studentData.entityList[i][2].toFixed(2);
    		}
    		$scope.dataLength = studentData.length;
    		$scope.tableData = new ngTableParams({
    			page: 1,            // show first page
    			count: 10           // count per page
    		}, {
    			total: studentData.entityList.length, // length of data
    			getData: function ($defer, params) {
    				$defer.resolve(studentData.entityList.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    			}
    		});
    		$("#container").slideUp("slow");
    		//$("#table").slideUp("slow");
    		$("#table").show("fast");
    		$("#showButton").show();
    	}

    	function getStudentList(status) {
  /*  		attendanceReportService.getAttendanceBySection({status},successCb, errorCb);
    		function successCb(result) {
    			if(result.entityList.length) {
    				formGrid(result);
    			}
    			$log.debug("SUCCESS getStudentAttendanceBySection",result);
    		}
    		function errorCb(error) {
    			$log.debug("FAILURE getStudentAttendanceBySection:",error)
    		}*/
			
    		
    		$http.get( commonService.baseApi+'/attendance/section?status='+status)
    		.success(function (data, status, headers, config) {
    			if(data.entityList.length) {
    				formGrid(data);
    			}
    		});
    	}

    	function generateGridData(currentDiv) {
    		var section;
    		$("#table").hide();
    		var status = [];
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



    	//Get Student Attendance Report
    	function getStudentReport(jsonArr,drillArr){
    		// Internationalization
    		Highcharts.setOptions({
    			lang: {
    				drillUpText: ' Back '
    			}
    		});

    		var options = {
    				chart: {
    					/*  events: {
    	                        drilldown: function (e) {
    	                            generateDrillDownJSON(e, false);
    	                        },
    	                        drillup: function (e) {
    	                            generateDrillDownJSON(e, true);
    	                            $("#table").hide();
    	                        }
    	                    }*/
    				},

    				/*title: {
                        text: 'Attendance Report'
                    },
    				 */
    				title: {
    					text: mainTitle,
    					align: 'left',
    					margin: 35,
    					x: 25,
    					// y: 2,
    					style: {
    						color: '#5e5e5e',
    						fontWeight: 400,
    						fontSize: '14px',
    						fontFamily: 'roboto',

    					},
    				},
    				subtitle: {
    					text: overallPercentage,
    					align: 'right',
    					// margin: 30,
    					y: 15,
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
    						text: 'Month',
    						style: {
    							color: '#000',
    							fontWeight: 500,
    							fontSize: '14px',
    							fontFamily: 'roboto',
    						},
    					},
    					/*	labels: {
    		                rotation: -45
    		            }*/
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
    				drilldown: {
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
    							//	format: '{point.y:.1f}%'
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

    	/* $scope.hideChart = function(){
        	$("#container").slideUp("slow");
        	$("#hideButton").hide();
        	$("#showButton").show();
        }*/
    	function showChart(){
    		$(".chart-content").mCustomScrollbar({theme:"dark-3", axis:"x"});
    		$("#table").slideDown("fast");
    		$timeout(function () {
    			$("#showButton").hide();
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