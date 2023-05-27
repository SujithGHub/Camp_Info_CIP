(function() {
    'use strict';
    
    angular
        .module('cip.studentHomework')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

    	$stateProvider
    	.state('studenthomework', {
    		url: "/studenthomework",
    		templateUrl: "app/studentHomework/views/studentHomework.html",
    		controller: "StudentHomeworkController",
    		controllerAs: "studentHomeworkCtrl"
    	});
    }

})();