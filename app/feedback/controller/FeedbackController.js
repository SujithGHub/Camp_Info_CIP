(function() {
	'use strict';
	/**
	 * @author Deepa
	 */
	angular
	.module('cip.feedback')
	.controller('FeedbackController', FeedbackController);

	FeedbackController.$inject = ['$mdDialog', '$http', '$log','FeedbackService','$scope','SharedService'];

	/* @ngInject */
	function FeedbackController($mdDialog,$http,$log,feedbackService,$scope,sharedService) {
		var vm = this;

		vm.init = init;
		vm.getClosedFeedbacks = getClosedFeedbacks;
		vm.getFeedbackList = getFeedbackList;
		vm.saveFeedback = saveFeedback;

		vm.mScope 					= {};
		vm.role = sessionStorage.getItem('role');

		function init() {

			setTimeout(function(){feedbackService.initTable('pendingFeedbackTable');},100)
		}

		function saveFeedback(form) {
			
			feedbackService.saveFeedback(form, successCb, errorCb);
        	function successCb(result) {
        		setTimeout(function(){feedbackService.initFeedbackTable('feedbackDataTable');},100)
        		$log.debug("SUCCESS saveFeedback:",result)
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE saveFeedback:",error)
        	}
        	
		}

		function addFeedbackComment(form,feedback) {
			feedback.feedbackStatus = form.feedbackStatus;
			if(form.comment) {
				feedback.feedbackComments = [];
				var feedbackComment = {};
				feedbackComment.comment = form.comment;
				feedbackComment.commentedBy = sharedService.userDetails.institute.instituteName;
				feedbackComment.feedback = {'id':feedback.id}
				feedback.feedbackComments.push(feedbackComment);
			}
		
			feedbackService.updateFeedback(feedback, successCb, errorCb);
        	function successCb(result) {
        		setTimeout(function(){feedbackService.initTable('pendingFeedbackTable');},100)
        		$log.debug("SUCCESS updateFeedback:",result)
        	}
        	function errorCb(error) {
        		$log.debug("FAILURE updateFeedback:",error)
        	}
		}



		function getValue() {
			var data ={};
			var ev;
			var table = $('#pendingFeedbackTable').dataTable();
			$(".selected", table.fnGetNodes()).each(function() {
				data = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
				ev = $(this);
			});

			$mdDialog.show({
				controller: function ($mdDialog) {
					var vm = this;
					vm.mForm = {}
					vm.mForm.feedbackStatus = data.feedbackStatus;
					vm.hide = function () {
						$mdDialog.hide();
					};
					vm.addComment = function(formData) {
						vm.hide();
						addFeedbackComment(formData,data);
					}
				},
				controllerAs: 'modal',
				templateUrl: '/app/feedback/views/addFeedbackComment.html',
				parent: angular.element(document.body),
				targetEvent: ev,
			});

		}

		$scope.updateStatus = function() {
			setTimeout(function(){ getValue(); }, 0);
		};

		function getClosedFeedbacks() {
			setTimeout(function(){feedbackService.initClosedFeedbacks('closedFeedbackTable', {});},100)
		}

		function getFeedbackList() {
			setTimeout(function(){feedbackService.initFeedbackTable('feedbackDataTable', {});},100)
		}

		function showModal(data,ev) {
			$mdDialog.show({
				controller: function ($mdDialog) {
					var vm = this;
					vm.mForm = {}
					vm.mForm.description = data.description;
					vm.feedbackComments = data.feedbackComments;
					vm.hide = function () {    
						$mdDialog.hide();
					};

				},
				controllerAs: 'modal',
				templateUrl: '/app/feedback/views/showFeedbackComment.html',
				parent: angular.element(document.body),
				targetEvent: ev,
			});

		}


		function getFeedbackData(type) {
			var feedbackData ={};
			var table;
			var ev;
			if(type == 'pendingFeedback') {
				table = $('#pendingFeedbackTable').dataTable();
			}else if(type == 'closedFeedback') {
				table = $('#closedFeedbackTable').dataTable();
			}else {
				table = $('#feedbackDataTable').dataTable();
			}

			$(".selected", table.fnGetNodes()).each(function() {
				feedbackData = table.fnGetData($(this).parents())
				$(this).removeClass('selected');
				ev = $(this);
			});

			if(type != 'feedback') {
				var id = feedbackData.id;
				feedbackService.getFeedbackComments({id}, successCb, errorCb);
	        	function successCb(result) {
	        		feedbackData.feedbackComments = result.entityList;
					showModal(feedbackData,ev);
	        		$log.debug("SUCCESS getFeedbackComments:",result)
	        	}
	        	function errorCb(error) {
	        		$log.debug("FAILURE getFeedbackComments:",error)
	        	}
	        	
			}else {
				showModal(feedbackData,ev);
			}

		}

		$scope.showFeedback = function(type) {
			setTimeout(function(){ getFeedbackData(type); }, 0);
		};
		
	}

})();