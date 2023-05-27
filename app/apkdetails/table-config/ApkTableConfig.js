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
			'description': {
				column: {
					sTitle: 'description',
					name: 'description',
				},
				columnDef: {
					mDataProp:'description'
				}
			},
			'is_latest': {
				column: {
					sTitle: 'latest',
					name: 'isLatest',
				},
				columnDef: {
					mDataProp:'isLatest'
				}
			},
			'release_name': {
				column: {
					sTitle: 'release name',
					name: 'releaseName',
				},
				columnDef: {
					mDataProp:'releaseName'
				}
			},
			'version': {
				column: {
					sTitle: 'version',
					name: 'version',
				},
				columnDef: {
					mDataProp:'version'
				}
			},
			'action': {
				column: {
					sTitle: 'Action',
				},
				columnDef: {
					render:function(data, type, row, meta) {
						return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteApkDetails('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>";
					}
				}
			},
		};
	};
	var headers = [
	               's_no',
	               'description',
	               'is_latest',
	               'release_name',
	               'version',
	               'action'
	               ];

	/**
	 * @name ApkDetailsTable
	 * @module apkDetails
	 * @description
	 *
	 *
	 * @author Krishna
	 * @copyright
	 */
	angular
	.module('cip.apkDetails')
	.value('ApkDetailsTable', {headers: headers, headersDef: headersDef});
}());