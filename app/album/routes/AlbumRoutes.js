(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.album')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('album', {
                url: "/album",
                templateUrl: "app/album/views/albumList.html",
                controller: "AlbumController",
                controllerAs: "albumCtrl"
            }).state('viewalbum', {
                url: "/viewalbum",
                templateUrl: "app/album/views/viewAlbum.html",
                controller: "AlbumController",
                controllerAs: "albumCtrl"
            });
    }

})();