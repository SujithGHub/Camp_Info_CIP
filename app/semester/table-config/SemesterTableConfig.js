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
			'Class_year': {
				column: {
					sTitle: 'Year',
					name: 'classYear',
				},
				columnDef: {
					mDataProp:'classYear',
				}
			},
			'semester': {
				column: {
					sTitle: 'Semester',
					name: 'semester',
				},
				columnDef: {
					mDataProp:'semester',
				}
			},
			'action': {
				column: {
					sTitle: 'Action',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateSemester('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>";
					}
				}
			},
		};
	};
	var headers = [ 
	               's_no',
	               'Class_year',
	               'semester',
	               'action'
	               ];

	var SemesterTable = {
			headers: headers,
			headersDef: headersDef,
			config: function(commonService) {
				return {
					sScrollY: '500px',
					iDisplayLength: 10,
					order: [],
					fnServerData: function(sSource, aoData, fnCallback, oSettings) {
						var start=oSettings._iDisplayStart;
						var limit=commonService.startParams();

						oSettings.jqXHR = $.ajax({
							type: 'get',
							beforeSend: function(request) {
								request.setRequestHeader("Authorization", "Bearer" + localStorage.getItem('jwt-token'));
							  },
							url: commonService.baseApi + '/semester?start='+start+'&limit='+limit+'&searchValue='+commonService.filterParams('search', aoData).value || '',
							success: function(json) {
								var data = {};
								data.sEcho = commonService.filterParams('sEcho', aoData)? commonService.filterParams('sEcho', aoData).value : 0 ;
								data.iTotalDisplayRecords = json.totalCount; //Display Total Records
								data.iTotalRecords = json.entityList.length || 0;
								data.aaData = json.entityList;
								fnCallback(data);
							},
							error: function(e) {
								fnCallback({ aaData: [] });
							}
						});
					},
				};
			}
	};

	/**
	 * @name SemesterTable
	 * @module semester
	 * @description
	 *
	 *
	 * @author Gunasekaran jayaraj
	 * @copyright
	 */
	angular
	.module('cip.semester')
	.value('SemesterTable', SemesterTable);
}());