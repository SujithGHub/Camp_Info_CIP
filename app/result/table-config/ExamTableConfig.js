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
			'exam name': {
				column: {
					sTitle: 'exam name',
					name: 'exam name',
				},
				columnDef: {
					mDataProp:'examName',
				/*	bSortable: true,
					render: function(data, type, row, meta) {
						return row.name;
					}*/
				}
			},
			'department name': {
				column: {
					sTitle: 'department name',
					name: 'department name',
				},
				columnDef: {
					mDataProp:'department.name'
				}
			},
			 'standard': {
					column: {
						sTitle: 'Standard',
						name: 'standard',
					},
					columnDef: {
						mDataProp:'classYear.name'
					}
				},
			'year': {
				column: {
					sTitle: 'year',
					name: 'year',
				},
				columnDef: {
					mDataProp:'classYear.name'
				}
			},
			'section': {
				column: {
					sTitle: 'section',
					name: 'section',
				},
				columnDef: {
					mDataProp:'section.sectionName'
				}
			},
			'view': {
				column: {
					sTitle: 'view',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return "<button class='btn bgm-teal btn-xs'  onclick=\"angular.element(this).scope().setResult();$(this).addClass('selected')\" data-ui-sref='viewResult'>"+
                             "<i class='zmdi zmdi-eye zmdi-hc-fw'></i></button>";
					}
				}
			},
		};
	};
	var headers = {
	                's_no':['School','College'],
	               'exam name':['School','College'],         
	               'department name':['College'],
	               'standard': ['School'],
	               'section' : ['College','School'],
	               'year':['College'],
	               'view':['School','College']
	};

	var ExamTable = {
			headers: headers,
			headersDef: headersDef,
			config: function(commonService,paramObj) {
				return {
					sScrollY: '500px',
					iDisplayLength: 10,
					order: [],
					fnServerData: function(sSource, aoData, fnCallback, oSettings) {
						var start=oSettings._iDisplayStart;
						var limit=commonService.startParams();
						oSettings.jqXHR = $.ajax({
							type: 'get',
							url: commonService.baseApi+'/examination/rollno?start='+start+'&limit='+limit+'&rollNo='+paramObj.rollNo+'&searchValue='+commonService.filterParams('search', aoData).value || '',
							beforeSend: function(request) {
								request.setRequestHeader("Authorization", "Bearer" + localStorage.getItem('jwt-token'));
							},
							success: function(json) {
								var data = {};
								data.sEcho = commonService.filterParams('sEcho', aoData)? commonService.filterParams('sEcho', aoData).value : 0 ;
								data.iTotalDisplayRecords = json. totalCount; //Display Total Records
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
	 * @name ExamTable
	 * @module result
	 * @description
	 *
	 *
	 * @author Deepa
	 * @copyright
	 */
	angular
	.module('cip.result')
	.value('ExamTable', ExamTable);
}());