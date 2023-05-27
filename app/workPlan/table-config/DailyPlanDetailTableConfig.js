(function() {
	'use strict';


    /**
     * @author Krishna
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
			'department': {
				column: {
					sTitle: 'Department',
					name: '',
				},
				columnDef: {
					mDataProp:'department.displayName'
				}
			},
			'date': {
				column: {
					sTitle: 'Plan Date',
					name: '',
				},
				columnDef: {
					mDataProp:'planDate'
				}
			},
			
			'action': {
				column: {
					sTitle: 'Action',
				},
				columnDef: {
					render: function(data, type, row, meta) {
						return  "<button class='btn btn-cancel btn-xs waves-effect' onclick=\"angular.element(this).scope().updateDailyPlanDetail('plandetail');$(this).addClass('selected')\"> <i class='zmdi zmdi-eye zmdi-hc-fw'></i> </button>";
					}
				}
			},
		};
	};
	var headers = [
			's_no',
			'department',
			'date',
			'action'
	];

	var DailyPlanDetailTable = {
			headers: headers,
			headersDef: headersDef,
			config: function(commonService, workPlanfilter) {
				return {
					sScrollY: '500px',
					iDisplayLength: 10,
					order: [],
					fnServerData: function(sSource, aoData, fnCallback, oSettings) {
						var start=oSettings._iDisplayStart;
						var limit=commonService.startParams();
						oSettings.jqXHR = $.ajax({
							type: 'get',
							data: workPlanfilter,
							url: '/workplan/dailyplan?start='+start+'&limit='+limit+'&searchValue='+commonService.filterParams('search', aoData).value || '',
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
	
	angular
	.module('cip.workPlan')
	.value('DailyPlanDetailTable', DailyPlanDetailTable);
}());