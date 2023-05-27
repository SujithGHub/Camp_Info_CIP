(function() {
	'use strict';
	/*global angular, $*/
	/**
	 * @private
	 * @name headersDef
	 * @description
	 * It has column definition of the each header in the accuracy module.
	 *
	 * @returns {Object} - Returns column configuration object
	 * associated with header name as key.
	 */

	var headersDef = function(obj) {
		return {
			'user_name': {
				column: {
					sTitle: 'user name',
					name: 'userName'
				},
				columnDef: {
					render: function(data, type, row) {
						return row.student.firstName +" "+ row.student.lastName;
					}
				}
			},
			'mobile': {
				column: {
					sTitle: 'mobile',
					name: 'mobile'
				},
				columnDef: {
					mDataProp:'user.username'
				}
			},
			'email': {
				column: {
					sTitle: 'email',
					name: 'email'
				},
				columnDef: {
					mDataProp:'user.Student.emailId'
				}
			},
			'feedback': {
				column: {
					sTitle: 'feedback',
					name: 'feedback'
				},
				columnDef: {
					mDataProp:'description',
					render: function (data, type, row, meta){
						return row.description.length>25 ? row.description.substr(0,25-1)+'...' : row.description;
					}
				}
			},
			'status': {
				column: {
					sTitle: 'status',
					name: 'status'
				},
				columnDef: {
					mDataProp:'feedbackStatus'
				}
			},

			'action': {
				column: {
					sTitle: 'Action'
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return  "<button class='btn bgm-teal btn-xs waves-effect' onclick=\"angular.element(this).scope().updateStatus();$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>&nbsp"+
						"<button class='btn btn-cancel btn-xs waves-effect' onclick=\"angular.element(this).scope().showFeedback('pendingFeedback');$(this).addClass('selected')\"> <i class='zmdi zmdi-eye zmdi-hc-fw'></i> </button>&nbsp"  
					}
				}
			},
		};
	};
	var headers = {
	               'user_name':['School','College'],   
	               'mobile':['School','College'],
	               'email':['School','College'],
	               'feedback':['School','College'],
	               'status':['School','College'],
	               'action':['School','College']
	};

	/**
	 * @name FeedbackTable
	 * @module feedback
	 * @author Deepa
	 * @copyright
	 */
	angular
	.module('cip.feedback')
	.value('PendingFeedbackTable', {headers: headers, headersDef: headersDef});
}());