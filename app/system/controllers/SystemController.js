(function() {
	'use strict';
	/**
	 * @author Gowthaman
	 */
	angular
	.module('cip')
	.controller('SystemController', SystemController);

	SystemController.$inject = ['menus', '$scope', '$window', '$http', '$mdToast', '$log', 'NotificationService', 'ClassifiedService', 'EventService', 'AlbumService', 'SystemService', 'AcademicService', 'SharedService', '$mdDialog', 'CommonService', '$timeout','$compile','$state', '$rootScope'];

	/* @ngInject */
	function SystemController(menus,$scope, $window, $http, $mdToast, $log, notificationService, classifiedService, eventService, albumService, systemService, academicService,sharedService, $mdDialog, commonService, $timeout,$compile,$state, $rootScope) {
		var vm = this;
		vm.showDarkTheme = true;
		vm.init = init;
		vm.systemInit = systemInit;
		vm.getClassifiedList = getClassifiedList;
		vm.getLatestEvents = getLatestEvents;
		vm.getAlbumList = getAlbumList;
		vm.getProfileImage = getProfileImage;
		$scope.tabIndex = 0;
		vm.messages = [];
		vm.loggedIn = localStorage.getItem('jwt-token') ? true :false;
		var xAxisTitle;
		var deptArr = [];
		var jsonArr = [];
		var chart1 ;
		var myJSON = [];
		var UNDEFINED;
		vm.showAcademic = true;

		$scope.$on('session_expire', function(){
			if (sharedService.institute == undefined) {
				var prefix = 'campinfo';
			} else {
				var prefix = sharedService.institute.prefix;
			}
			$mdDialog.show({
				controller: function ($mdDialog) {
					var vm = this;
					vm.confirm = function () {
						$window.location.href = "/";
					};
				},
				controllerAs: 'modalCtrl',
				template: '<md-dialog aria-label="login expire" ng-cloak style="width: 30%;">'
					+'<md-dialog-content class="md-dialog-content"><h2 class="md-title ng-binding" style="color: red;">Your Session has been Expired</h2><div class="md-dialog-content-body ng-scope"><p class="ng-binding">Please Log in to Continue</p></div><p style="text-align:center"><button class="btn btn-cancel" style="margin: 20px 2px 0;box-shadow: 0 2px 5px rgba(0,0,0,0.16),0 2px 10px rgba(0,0,0,0.12);" data-ng-click="modalCtrl.confirm()">Ok</button></p></md-dialog-content>'
					+'</md-dialog>',
					parent: angular.element(document.body),
					clickOutsideToClose: false
			});
		});


		function init() {
			vm.loggedIn = localStorage.getItem('jwt-token') ? true :false;
			systemInit();
            if(localStorage.getItem('jwt-token')) {
                if (vm.role == undefined) {
                    $timeout(function () {
                        if (vm.role != 'ROLE_SUPER_ADMIN') {
                            getAlbumList();
                            getClassifiedList();
                            getReport();
                            getLatestEvents();
                        }

                    }, 500);
                } else {
                    if (vm.role != 'ROLE_SUPER_ADMIN') {
                        getAlbumList();
                        getClassifiedList();
                        getReport();
                        getLatestEvents();
                    }
                }
            }
		}

		function systemInit() {
		    if(localStorage.getItem('jwt-token')){
                getFeatures();
                getUser();
                getInstitute();
                getCurrentAcademicYear();
            }
		}

		vm.toggleState = function() {
			document.getElementsByClassName("sidebar")[0].classList.toggle("open");
			vm.state = !vm.state;
			if(document.getElementById("mySidenav")){
				if(document.getElementsByClassName("arrow-right").length == "0"){
					document.getElementById("mySidenav").style.marginLeft = "232px";
				} else{
					document.getElementById("mySidenav").style.marginLeft = "10px";
				}
			}
		}

		function getToast(name) {
			$mdToast.show(
					$mdToast.simple()
					.textContent('Welcome '+name +'!')
					.position("top")
					.hideDelay(3000)
			);
		}

		function getUser() {
			systemService.getUser(successCb, errorCb);
			function successCb(result) {
				sharedService.setUserDetails(result.entity);
				$rootScope.userInfo = result.entity;
				vm.userDetails = result.entity;
				vm.role = result.entity.roles[0].name;
				sessionStorage.setItem("role",vm.role)
				if(sharedService.userDetails.roles[0].name === "ROLE_ADMIN"){
					getToast(sharedService.userDetails.institute.instituteName);
					sessionStorage.setItem('instituteName',vm.userDetails.institute.instituteName)
				} else if(sharedService.userDetails.roles[0].name === "ROLE_STAFF" || sharedService.userDetails.roles[0].name === "ROLE_STAFF_HOD"){
					getToast(sharedService.userDetails.staff.firstName);
					sessionStorage.setItem('staffName',vm.userDetails.staff.firstName)
				} else if(sharedService.userDetails.roles[0].name === "ROLE_USER"){
					getToast(sharedService.userDetails.student.firstName);
					sessionStorage.setItem('studentName',vm.userDetails.student.firstName)
					sessionStorage.setItem('classYear',vm.userDetails.student.classYear.id)
					sessionStorage.setItem('section',vm.userDetails.student.section.id)
				} else if(sharedService.userDetails.roles[0].name === "ROLE_SUPER_ADMIN"){
					getToast('Admin');
				}
				$log.debug("SUCCESS getUser:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE getUser:",error)
			}
		}

		vm.closeLicenceWarning = function() {
			$('#licence-warn').hide();	
		};

		function getInstitute() {
			systemService.getInstitute(successCb, errorCb);
			function successCb(result) {
				if(!result.entity){
					return
				}
				sharedService.setInstitute(result.entity);
				sessionStorage.setItem('instituteType',result.entity.instituteType)
				$rootScope.instituteInfo = result.entity
				vm.instituteDetails = result.entity;
				vm.institute = result.entity;
				vm.instituteType = result.entity.instituteType;
				vm.days_to_expire = result.entity.daysToExpire;
				vm.expiryMessage;
				if(vm.days_to_expire == 1) {
					vm.expiryMessage = 'Today';
				}else if(vm.days_to_expire == 2) {
					vm.expiryMessage = 'Tommorrow';
				}else if(vm.days_to_expire <8) {
					vm.expiryMessage = 'in '+vm.days_to_expire+' days';
				}else if(vm.days_to_expire == 15) {
					vm.expiryMessage = 'in '+vm.days_to_expire+' days';
				}
				$log.debug("SUCCESS institute:",result)
			}
			function errorCb(error){
				$log.debug("FAILURE institute:",error)
			}
		}

		function getCurrentAcademicYear() {
			academicService.getCurrentAcademicYear(successCb,errorCb);
			function successCb(result) {
				if(!result.entity){
					return
				}
				sharedService.setCurrentAcademic(result.entity.academicYear);
				vm.currentAcademicYear = result.entity.academicYear;
				$log.debug("SUCCESS getCurrentAcademicYear:",result)
			}
			function errorCb(error){
				$log.debug("FAILURE getCurrentAcademicYear:",error)
			}
		}

		function getFeatures() {
			systemService.getFeatures(successCb,errorCb);
			function successCb(result) {
				angular.forEach(result, function (feature) {
					feature.id = parseFloat(feature.id);
				});
				vm.menuJson = result;
				$log.debug("SUCCESS getFeatures:",result)
			}
			function errorCb(error){
				$log.debug("FAILURE getFeatures:",error)
			}
		}

		vm.viewClassifieds = function(ev, data) {
			$mdDialog.show({
				controller: SystemController,
				controllerAs: 'classifiedCtrl',
				templateUrl: '/app/classifieds/views/classifiedDescription.html',
				parent: angular.element(document.body),
				bindToController: true,
				locals: {
					formData: data
				},
				clickOutsideToClose:false
			})
		};

		vm.cancel = function() {
			$mdDialog.cancel();
		}

		vm.viewEvents = function(data) {
			$mdDialog.show({
				controller: SystemController,
				controllerAs: 'systemCtrl',
				templateUrl: '/app/system/views/viewDashboardEvent.html',
				parent: angular.element(document.body),
				bindToController: true,
				locals: {
					scopeValue: data
				},
				clickOutsideToClose:false
			})
		}

		function getClassifiedList() {
			classifiedService.getDashboardClassified(successCb, errorCb);
			function successCb(result){
				vm.classifiedList = result.entityList;
				$log.debug("SUCCESS getClassifiedList:",result)
			}
			function errorCb(error){
				$log.debug("FAILURE getClassifiedList:",error)
			}
		}

		var slideIndex = 0;

		function carousel() {
			var i;
			var x = document.getElementsByClassName("mySlides");
			for (i = 0; i < x.length; i++) {
				x[i].style.display = "none";
			}
			slideIndex++;
			if (slideIndex > x.length) {
				slideIndex = 1
			}
			if(x[slideIndex - 1] != undefined) {
				x[slideIndex - 1].style.display = "block";
			}
			$('.w3-content').show();
			setTimeout(carousel, 3000); // Change image every 2 seconds

		} 

		vm.plusDivs = function(n) {
			showDivs(slideIndex += n);
		}

		function showDivs(n) {
			var i;
			var x = document.getElementsByClassName("mySlides");
			if (n > x.length) {
				slideIndex = 1
			}
			if (n < 1) {
				slideIndex = x.length
			}
			for (i = 0; i < x.length; i++) {
				x[i].style.display = "none";
			}
			x[slideIndex - 1].style.display = "block";
		} 

		function getAlbumList() {
			albumService.getAlbumList(successCb, errorCb);
			$('.w3-content').hide();
			function successCb(result){
				vm.albumList = result.entityList;
				if(vm.albumList.length) {
					//	carousel();
					setTimeout(carousel, 500); 

				}

				$log.debug("SUCCESS getAlbumList:",result)
			}
			function errorCb(error){
				$log.debug("FAILURE getAlbumList:",error)
			}
		}

		function getLatestEvents() {
			eventService.getLatestEvents(successCb, errorCb);
			function successCb(result){
				vm.eventList = result.entityList;
				$log.debug("SUCCESS getLatestEvents:",result)
			}
			function errorCb(error){
				$log.debug("FAILURE getLatestEvents:",error)
			}
		}

		vm.initProfile = function() {
			getProfileImage();
			if(sharedService.userDetails.roles[0].name === "ROLE_ADMIN"){
				vm.getbackGroundImage();
				vm.profileData = sharedService.userDetails.institute;
				vm.institute = sharedService.institute;
			}else if(sharedService.userDetails.roles[0].name === "ROLE_STAFF" || sharedService.userDetails.roles[0].name === "ROLE_STAFF_HOD"){
				vm.profileData = sharedService.userDetails.staff;
			}else if(sharedService.userDetails.roles[0].name === "ROLE_USER"){
				vm.profileData = sharedService.userDetails.student;
			}
			vm.userDetails = sharedService.userDetails;
		};

		$scope.hoverIn = function(){
			this.hoverEdit = true;
		};

		$scope.hoverOut = function(){
			this.hoverEdit = false;
		};

		vm.formatDOB = function() {
			vm.profileData.dob	=	commonService.convertDatePickerFormat(vm.profileData.dob);
		}

		vm.updateProfile = function(formData) {
			formData.dob	=	commonService.convertDateFormat(formData.dob);
			if(formData.dateOfJoining)
				formData.dateOfJoining	=	commonService.convertDateFormat(formData.dateOfJoining);
			if(formData.dateOfCompletion)
				formData.dateOfCompletion	=	commonService.convertDateFormat(formData.dateOfCompletion);
			systemService.updateProfile(formData, successCb, errorCb)

			function successCb(result) {
				vm.showChangePassword = false;
				vm.showEditProfile = false;
				getInstitute();
				$log.debug("SUCCESS updateProfile:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE updateProfile:",error)
			}
		}

		vm.changePassword = function(data) {
			systemService.changePassword(data, successCb, errorCb)

			function successCb(result) {
				vm.showChangePassword = false;
				vm.showEditProfile = false;
				vm.form = {};
				$log.debug("SUCCESS changePassword:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE changePassword:",error)
			}
		};

		function getProfileImage(){
			systemService.getProfileImage(successCb, errorCb)
			function successCb(result) {
				vm.profileImageList = result;
				$log.debug("SUCCESS getProfileImage:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE getProfileImage:",error)
			}
		}

		vm.setProfilePicture = function(data) {
			var arr = [];
			arr.push(data);
			systemService.setProfilePicture(arr,successCb, errorCb)

			function successCb(result) {
				vm.userDetails = result.entity;
				sharedService.setUserDetails(result.entity);
				$log.debug("SUCCESS setProfilePicture:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE setProfilePicture:",error)
			}
		};

		vm.deleteProfilePicture = function(data) {
			var arr = [];
			arr.push(data);
			systemService.deleteProfilePicture(arr,successCb, errorCb)
			function successCb(result) {
				vm.deletedProfilePicture = result;
				getProfileImage();
				if(vm.userDetails.profilePath == data){
					$scope.uploadFile(this,false);
				}
				$log.debug("SUCCESS deleteProfilePicture:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE deleteProfilePicture:",error)
			}
		}

		vm.click = function(id) {
			$(id).click();
		};

		$scope.uploadFile = function(element,upload) {
			var data = new FormData();
			if(upload == true) 
				data.append('file', $(element)[0].files[0]);
			$http({
				method: 'post',
				url:  commonService.baseApi+'/user/upload/profile',
				headers: {'Content-Type': undefined},
				data: data,
				transformRequest: function(data, headersGetterFunction) {
					return data; // do nothing! FormData is very good!
				}
			}).success(function(data, status) {
				vm.userDetails = data.entity;
				sharedService.setUserDetails(data.entity);
				getProfileImage();
			}).error(function(data, status) {

			});
		};

		$scope.uploadLogo = function(element) {

			if($(element)[0].files[0] != undefined) {
				var data = new FormData();
				data.append('file', $(element)[0].files[0]);
				$http({
					method: 'post',
					url:  commonService.baseApi+'/institute/upload/logo',
					headers: {'Content-Type': undefined},
					data: data,
					transformRequest: function(data, headersGetterFunction) {
						return data;
					}
				}).success(function(data, status) {
					vm.institute =  data.entity;
					sharedService.institute = data.entity;
					vm.profileData =  data.entity;
					vm.instituteDetails = data.entity;
					sharedService.userDetails.institute = data.entity;
				});
			}

		};

		vm.getbackGroundImage = function() {
			albumService.getbackGroundImage({type : sharedService.institute.prefix},successCb, errorCb)
			function successCb(result) {
				vm.backgroundImageList = result; 
				vm.noBackgroundImage =  true;
				if(Object.keys(vm.backgroundImageList).length > 2){
					vm.noBackgroundImage =  false;
				}
				
				$log.debug("SUCCESS getbackGroundImage:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE getbackGroundImage:",error)
			}
		};

		vm.deleteBackGroundImage = function (imageKey) {
			var data = [];
			data.push(imageKey);
			data.push(sharedService.institute.prefix);
			albumService.deleteBackGroundImage(data,successCb, errorCb)
			function successCb(result) {
				vm.getbackGroundImage();
				$log.debug("SUCCESS deleteBackGroundImage:",result)
			}
			function errorCb(error) {
				$log.debug("FAILURE deleteBackGroundImage:",error)
			}
		};

		$scope.readFile = function(element) {
           $scope.$apply(function(scope) {
            if($(element)[0].files.length) {
                 $scope.fileName = $(element)[0].files[0].name;
                 $scope.fileLength = $(element)[0].files.length;
            }   
            });
           
           $scope.invalidFileName = [];
           var fileFormat=['jpg','jpeg','png']
           $('.fileInput').each(function(){
   			for(var i=0;i<this.files.length;i++) {
   				var j=this.files[i].name.split(".");
   				var ext=j[j.length-1];
   				if(fileFormat.indexOf(ext) == -1) {
   					$scope.invalidFileName.push({name : this.files[i].name})
   				}
   			}
   		});
           
        };
       vm.resetTabIndex = function() {
    	   $scope.tabIndex = 0;
       }
       
       
       
        $scope.uploadBackgroundImages = function() {
        	if(!$scope.invalidFileName.length) {
        		var data = new FormData();
        		var length;
        		$('.fileInput').each(function(){
        			length = this.files.length
	
        			for(var i=0;i<this.files.length;i++) {
        				data.append("file_"+(i+1), this.files[i]);
        			}
        		});
        		data.append("length", length);
        		data.append("prefix", sharedService.institute.prefix);
        		data.append("instituteName", sharedService.institute.instituteName);
        		$http({
        			method: 'post',
        			url:  commonService.baseApi+'/albums/upload/background/images',
        			headers: {'Content-Type': undefined},
        			data: data,
        			transformRequest: function(data, headersGetterFunction) {
        				return data;
        			}
        		}).success(function(data, status) {
        			vm.clearFile(); 
        			$state.reload();
        			$scope.tabIndex = 2;
        			vm.getbackGroundImage();
        		})
        	}
    	}
        
        
	        
	    vm.clearFile = function() {
	    	$scope.fileName = '';
	    	$scope.fileLength = '';
	    	$(".fileInput").val('');
	     };

		function getCurrentDayReport(){
			// Internationalization
			Highcharts.setOptions({
				lang: {
					drillUpText: ' Back '
				}
			});

			var options = {
					chart: {
						events: {
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
								fontSize: '12px',
								fontFamily: 'roboto',
							},
						},
					},
					yAxis: {
						tickInterval: 25,
						title: {
							text: 'Percentage (%)',
							style: {
								color: '#000',
								fontWeight: 500,
								fontSize: '12px',
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
							groupPadding: 0.1,
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
												//generateGridData(this);
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

		function getAttendanceReport(){
			jsonArr = [];
			$http.get( commonService.baseApi+'/attendance/month/report?instituteType='+vm.instituteType)
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
						});
					}else {
						activeData++;
						jsonArr.push({
							name: i,
						});
					}
					if(Object.keys(data[0]).length == count) {
						if(Object.keys(data[0]).length == activeData) {
							$("#container").html("<br><br><br><br><center><h4>No Record Found</h4></center>");
							vm.showAcademic = false;
						} else {
							var drillArr = getCurrentDayReport();
						}
					}
				}
			});
		}

		//Get Student Attendance Report
		function getStudentReport(jsonArr){
			// Internationalization
			Highcharts.setOptions({
				lang: {
					drillUpText: ' Back '
				}
			});

			var options = {
					chart: {

					},

					xAxis: {
						categories: true,
						title: {
							text: 'Month',
							style: {
								color: '#000',
								fontWeight: 500,
								fontSize: '12px',
								fontFamily: 'roboto',
							},
						},

					},
					yAxis: {
						tickInterval: 25,
						title: {
							text: 'Percentage (%)',
							style: {
								color: '#000',
								fontWeight: 500,
								fontSize: '12px',
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
							pointWidth: 35,
							pointPadding: 0, 
							groupPadding: 0.01,
							dataLabels: {
								borderWidth: 0,
								enabled: true,
								//format: '{point.y:.1f}%'
								format: '{point.y}%'
							},
							shadow: false,
							point: {
								events: {

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

		function getStudentAttendance(){
			jsonArr = [];
			$http.get( commonService.baseApi+'/attendance/monthwise/report')
			.success(function (data, status, headers, config) {
				var monthlyPercentage=data;
				var activeData = 0;
				if(Object.keys(data).length == 0){
					$("#container").html("<br><br><br><br><center><h4>No Record Found</h4></center>");
					return vm.showAcademic = false;
				}
				for (var i in monthlyPercentage) {
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
						});
					}
				}
				if(activeData == 12) {
					$("#container").html("<br><br><br><br><center><h4>No Record Found</h4></center>");
				} else {
					var drillArr = getStudentReport(jsonArr);
				}
			});
		}

		function getReportByRole() {
			if(vm.role != "ROLE_USER"){
				if(vm.instituteType == "School") {
					xAxisTitle = "Standard"
				}else if(vm.instituteType == "College"){
					xAxisTitle = "Department"
				}
				getAttendanceReport();
			}else {
				getStudentAttendance();
			}
		}

		function getReport() {

			if(vm.role == undefined || vm.instituteType == undefined) {
				$timeout(function () {
					getReportByRole();
				}, 1000);
			}else {
				getReportByRole();
			}

		}

		vm.checkCurrentPassword = function (currentPassword) {
			$http.get( commonService.baseApi+'/user/validate/password?currentPassword='+currentPassword)
			.success(function (data, status, headers, config) {
				vm.statusData = data
			});

		};

        vm.checkConfirmPassword = function (newPassword, confirmPassword) {
            vm.passwordMatch = angular.equals(newPassword, confirmPassword);
        };
        
        vm.loginStudentChange = function(id) {
     	   systemService.loginStudentChange({id}, successCb, errorCb);
     	   function successCb(result) {
     		  $window.location.href = "#/home";
 			}
 			function errorCb(error) {
 				
 			}
        };

        vm.logoutChat = function(id) {
        	// localStorage.clear();
			vm.loggedIn = false;
                if ((vm.role == 'ROLE_USER' || vm.role == 'ROLE_STAFF' || vm.role == 'ROLE_STAFF_HOD') && vm.institute.chatIsEnabled === true) {
                    var chatId = $rootScope.chatId;
                    systemService.logoutChat({chatId: chatId, status: 'offline'}, successCb, errorCb);

                    function successCb(result) {
                    	vm.logout();
                    }

                    function errorCb(error) {

                    }
                }else{
					vm.logout();
             }
        };

        vm.logout = function () {
			let logoutRequest = {};
			logoutRequest.authToken = localStorage.getItem('jwt-token');
			$http.post(commonService.baseApi + '/auth/logout',logoutRequest).success(function(data){
				$window.location.href ="/";
				localStorage.clear();
				sessionStorage.clear();
			})
		}

	}
})();