(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.blog')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('blog', {
                url: "/blog",
                templateUrl: "app/blog/views/blogIndex.html",
                controller : "BlogController",
                controllerAs : "blogCtrl"
            });
    }

})();