(function() {
	'use strict';

	/**
	 * @ngdoc Service
	 * @name FeedbackService
	 * @module cip.feedback
	 * FeedbackService
	 * @author
	 * @copyright
	 */

	angular
	.module('cip.feedback')
	.service('FeedbackService', FeedbackService);

	FeedbackService.$inject = [
	                           'PendingFeedbackTable',
	                           'ClosedFeedbackTable',
	                           'FeedbackTable',
	                           'CommonService',
	                           'FeedbackFactory'
	                           ];

	function FeedbackService(pendingFeedbackTable,closedFeedbackTable,feedbackTable,commonService,feedbackFactory) {
    
		this.initTable=function(tableElm) {
			commonService.setTableConfig(tableElm, pendingFeedbackTable, '/feedback/pending', true);
		};
		
		this.initClosedFeedbacks=function(tableElm) {
			commonService.setTableConfig(tableElm, closedFeedbackTable, '/feedback/closed', true);
		};
		
		this.initFeedbackTable=function(tableElm) {
			commonService.setTableConfig(tableElm, feedbackTable, '/feedback');
		};
		
		this.saveFeedback = function(params,successCb,errorCb){
    		feedbackFactory.saveFeedback(params,successCb,errorCb);
    	};
    	
    	this.updateFeedback = function(params,successCb,errorCb){
    		feedbackFactory.updateFeedback(params,successCb,errorCb);
    	};
    	
    	this.getFeedbackComments = function(params,successCb,errorCb){
    		feedbackFactory.get(params,successCb,errorCb);
    	};
	}

}());
