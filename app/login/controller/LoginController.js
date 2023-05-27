(function() {
    'use strict';
    /**
      * @author Ashokrajan
      */
    angular
        .module('cip.login')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$log', '$location', 'LoginService', '$window', '$scope','$http','$state'];

    /* @ngInject */
    function LoginController($log, $location, loginService, $window,$scope,$http,$state) {
        var vm = this;
        vm.init = init;
        
        function init() {
        	getLoginImages();
        }
        
        vm.windowHeight = $(window).height();
    	vm.windowWidth = $(window).width();
    	$(window).resize(function(){
    		$scope.$apply(function(){
    			vm.windowWidth = $(window).width();
    			vm.windowHeight = $(window).height();
    		});
    	});
        
        function getLoginImages() {
        	vm.prefix = "ADITYA";
        	if($location.search().institute) {
        		vm.prefix =$location.search().institute;
        	}
			loginService.getLoginImages({institute : vm.prefix}, successCb, errorCb)
			function successCb(result){
				vm.loginImages = result.imageList;
    			$scope.instituteName = result.instituteName;
    			if($scope.instituteName == undefined){
    				$scope.instituteName = 'Camp Info';
    			}
    			$scope.imageList = result.imageList;
    			if($scope.imageList == undefined || $scope.imageList.length == 0){
    				$scope.imageList = ['/assets/images/defaultImages/collegeImages/Camp Info_1.jpg','/assets/images/defaultImages/collegeImages/Camp Info_2.jpg','/assets/images/defaultImages/collegeImages/Camp Info_3.jpg'];
    				vm.loginImages = $scope.imageList;
    			}
    			$scope.instituteLogo = result.instituteLogo;
    			$('#l-login').show();
			}
			function errorCb(error){
				$('#l-login').show();
				$scope.imageList = ['/assets/images/defaultImages/collegeImages/Camp Info_1.jpg','/assets/images/defaultImages/collegeImages/Camp Info_2.jpg','/assets/images/defaultImages/collegeImages/Camp Info_3.jpg'];
				vm.loginImages = $scope.imageList;
				$scope.instituteName = 'Camp Info';
				$log.debug("FAILURE getLoginImages:",error);
			}
		}
        
        vm.sliderWithArrowOptions = {
        	    name: "sliderWithArrow",
        	    $DragOrientation: 1, 
        	     $AutoPlay: true,//[Optional] Allows keyboard (arrow key) navigation or not, default value is false
        	    $SlideDuration: 100
        	};

		$scope.login = function() {
			let user = {};
			user.username=$scope.username;
			user.password = $scope.password;
			$http({
				method: 'post',
				url: 'cip/api/auth/login',
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Expose-Header': 'Authorization',
				},
				data: user,

			}).then(function (response) {
				localStorage.setItem('jwt-token',response.data.entity.token.authToken)
				$http.defaults.headers.common['Authorization'] ="Bearer" + response.data.entity.token.authToken;
				$state.go('home')
			}).catch(function (error) {
				console.log(error)
			});
		}
        
    }
})();