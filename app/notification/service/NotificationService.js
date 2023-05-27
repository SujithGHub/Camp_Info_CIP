(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name NotificationService
     * @module cip.notification
     * NotificationService
     * @author
     * @copyright
     */
  
    angular
        .module('cip.notification')
        .service('NotificationService', NotificationService);

    NotificationService.$inject = [
        'NotificationFactory',
        'NotificationTable',
        'CommonService'
     ];

    function NotificationService(notificationFactory, notificationTable, commonService) {
    	
    	this.saveNotification = function(params,successCb,errorCb) {
    		notificationFactory.$save(params,successCb,errorCb);
    	};
    	this.updateNotification = function(params,successCb,errorCb) {
    		notificationFactory.$update(params,successCb,errorCb);
    	};
    	this.deleteNotificationc = function(params,successCb,errorCb) {
    		notificationFactory.$delete(params,successCb,errorCb);
    	};
    	this.getDashboardNotification = function(params,successCb,errorCb) {
    		notificationFactory.getDashboardNotification(params,successCb,errorCb);
    	};
    	this.initTable=function(tableElm,paramObj) {
    		commonService.setTableConfig(tableElm, notificationTable, '/notification', true);
		};
    }

}());
