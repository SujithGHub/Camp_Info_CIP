(function() {
	'use strict';

	/**
	 * @ngdoc Service
	 * @name EventService
	 * @module cip.events
	 * @require $log,
	 * @description
	 *
	 * EventService
	 *
	 * @author
	 * @copyright
	 */

	angular
	.module('cip.events')
	.service('EventService', EventService);

	EventService.$inject = [
	                        '$log',
	                        'CommonService',
	                        'EventTable',
	                        'ViewEventTable',
	                        'EventFactory'
	                        ];

	function EventService($log, commonService, eventTable, viewEventTable, eventFactory) {

		this.deleteEvent = function(params,successCb,errorCb){
			eventFactory.$delete(params,successCb,errorCb);
		};
		this.removeEventImage = function(params,successCb,errorCb){
			eventFactory.removeEventImage(params,successCb,errorCb);
		};
		this.getLatestEvents = function(params,successCb,errorCb){
			eventFactory.get(params,successCb,errorCb);
		};
		this.getEventCount = function(params,successCb,errorCb){
			eventFactory.getEventCount(params,successCb,errorCb);
		};
		this.autoDeleteEvent = function(params,successCb,errorCb){
			eventFactory.autoDeleteEvent(params,successCb,errorCb);
		};
		this.initTable=function(tableElm, tableName) {
			if(tableName=='event') {
				commonService.setTableConfig(tableElm, eventTable, '/events');
			}
			else {
				commonService.setTableConfig(tableElm, viewEventTable, '/events');
			}
		};
		this.getEventList = function(params,successCb,errorCb){
			eventFactory.getEventList(params,successCb,errorCb)
		};
	}

}());
