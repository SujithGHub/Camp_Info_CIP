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
			'institute_name': {
				column: {
					sTitle: 'Institute Name',
					name: 'instituteName',
				},
				columnDef: {
					mDataProp:'instituteName',
				}
			},
			'email': {
				column: {
					sTitle: 'Email',
					name: 'emailId',
				},
				columnDef: {
					mDataProp:'emailId',
				}
			},

			'action': {
				column: {
					sTitle: 'Action',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateFeature('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>";
					}
				}
			},
		};
	};
	var headers = [ 
	               's_no',
	               'institute_name',         
	               'email',
	               'action'
	               ];

	/**
	 * @name FeatureTable
	 * @module feature
	 * @author Krishna
	 * @copyright
	 */
	angular
	.module('cip.feature')
	.value('FeatureTable', {headers: headers, headersDef: headersDef});
}());