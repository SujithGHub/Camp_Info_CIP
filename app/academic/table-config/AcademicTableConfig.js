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
            'academic_year': {
                column: {
                    sTitle: 'ACADEMIC YEAR',
                    name: 'academicYear',
                },
                columnDef: {
                	 mDataProp:'academicYear',
                     bSortable: true,
                     render: function(data, type, row, meta) {
                         return row.academicYear;
                    }
                }
            },
            'fromDate': {
                column: {
                    sTitle: 'From Date',
                    name: 'fromDate',
                },
                columnDef: {
                    mDataProp:'fromDate',
                    render: function(data, type, row, meta) {
                        return  row.fromDate;
                    }
                }
            },
            'toDate': {
                column: {
                    sTitle: 'to Date',
                    name: 'toDate',
                },
                columnDef: {
                    mDataProp:'toDate'
                }
            },
            'status': {
                column: {
                    sTitle: 'status',
                    name: 'status',
                },
                columnDef: {
                    mDataProp:'status'
                }
            },
            'action': {
                column: {
                    sTitle: 'Action',
                },
                columnDef: {
                	render:function(data, type, row, meta) {
                		return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteAcademic('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>";
                    }
                }
            },
     };
    };
    var headers = [
          's_no',         
         'academic_year',         
         'fromDate',
         'toDate',
         'status',
         'action'
    ];

    /**
     * @name AcademicTable
     * @module Academic
     * @author Gowtham
     * @copyright
     */
    angular
        .module('cip.academic')
        .value('AcademicTable', {headers: headers, headersDef: headersDef});
}());