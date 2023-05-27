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
            'reg no': {
				column: {
					sTitle: 'reg no',
					name: 'reg no',
				},
				columnDef: {
					mDataProp:'student.rollNumber',
			
				}
			},
			'student name': {
				column: {
					sTitle: 'student name',
					name: 'student name',
				},
				columnDef: {
					mDataProp:'student.firstName',
			
				}
			},
			
			'max mark': {
				column: {
					sTitle: 'max marks',
					name: 'max mark',
				},
				columnDef: {
					mDataProp:'maxMark'
				}
			},
			'pass mark': {
				column: {
					sTitle: 'pass mark',
				},
				columnDef: {
					mDataProp:'passMark'
				}
			},
			'mark': {
				column: {
					sTitle: 'marks obtained',
					name: 'mark obtained',
				},
				columnDef: {
					mDataProp:'mark'
				}
			},
			'action': {
				column: {
					sTitle: 'Action',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteResult('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>";
					}
				}
			},
		};
	};
	var headers = [
	               's_no',
	               'reg no',
	               'student name',         
	               'max mark',
	               'pass mark',
	               'mark',
	               'action'
	               ];

	var ResultBySubjectTable = {
			headers: headers,
			headersDef: headersDef,
			config: function(commonService,paramObj,sharedService) {
				return {
					sScrollY: '500px',
					iDisplayLength: 10,
					order: [],
					fnServerData: function(sSource, aoData, fnCallback, oSettings) {
						var start=oSettings._iDisplayStart;
						var limit=commonService.startParams();
						oSettings.jqXHR = $.ajax({
							type: 'get',
							url: commonService.baseApi+'/result/subject?start='+start+'&limit='+limit+'&result='+paramObj.result+'&searchValue='+commonService.filterParams('search', aoData).value || '',
							beforeSend: function(request) {
								request.setRequestHeader("Authorization", "Bearer" + localStorage.getItem('jwt-token'));
							},
							success: function(json) {
								var data = {};
								if(json.entityList.length) {
									sharedService.setSubjectName(json.entityList[0].subject.subjectName);
									sharedService.setPassPercentage(json.entityList[0].avgMark);
									sharedService.setTotalCount(json.totalCount);
								}else {
									sharedService.setSubjectName('');
									sharedService.setPassPercentage('');
									sharedService.setTotalCount(0);
								}
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
	 * @name ResultBySubjectTable
	 * @module result
	 * @description
	 *
	 *
	 * @author Deepa
	 * @copyright
	 */
	angular
	.module('cip.result')
	.value('ResultBySubjectTable', ResultBySubjectTable);
	

}());