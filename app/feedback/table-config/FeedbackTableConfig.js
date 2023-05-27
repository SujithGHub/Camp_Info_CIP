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
       	 's_no': {
             column: {
                 sTitle: 's.no',
                 name: 's_no',
             },
             columnDef: {
					render: function(data, type, row, meta) {
						return meta.row + meta.settings._iDisplayStart + 1;
					}
				}
         },
			'feedback': {
				column: {
					sTitle: 'feedback',
					name: 'feedback',
				},
				columnDef: {
					mDataProp:'description',
					render: function (data, type, row, meta){
						return row.description.length>30 ? row.description.substr(0,30-1)+'...' : row.description;
					}
				}
			},
      'status': {
        column: {
          sTitle: 'status',
          name: 'status',
        },
        columnDef: {
          mDataProp:'feedbackStatus'
        }
      },

			'action': {
				column: {
					sTitle: 'Action',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return "<button class='btn btn-cancel btn-xs waves-effect' onclick=\"angular.element(this).scope().showFeedback('feedback');$(this).addClass('selected')\"> <i class='zmdi zmdi-eye zmdi-hc-fw'></i> </button>&nbsp"  
					}
				}
			},
		};
	};
	var headers = [
	               's_no',
	               'feedback',
    							'status',
    							'action'
	               ];

	/**
	 * @name FeedbackTable
	 * @module feedback
	 * @author Deepa
	 * @copyright
	 */
	angular
	.module('cip.feedback')
	.value('FeedbackTable', {headers: headers, headersDef: headersDef});
}());