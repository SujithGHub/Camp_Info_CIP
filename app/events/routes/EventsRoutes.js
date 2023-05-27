(function() {
    'use strict';

    /**
     * @author Ashokrajan
     */
    angular
        .module('cip.events')
        .config(config);

    config.$inject = [
        '$stateProvider',
        '$urlRouterProvider'
    ];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('events', {
                url: "/events",
                templateUrl: "app/events/views/eventsList.html",
                controller: "EventsController",
                controllerAs: "eventsCtrl"
            }).state('viewevents', {
                url: "/viewevents",
                templateUrl: "app/events/views/viewEvents.html",
                controller: "EventsController",
                controllerAs: "eventsCtrl"
            });
    }

})();