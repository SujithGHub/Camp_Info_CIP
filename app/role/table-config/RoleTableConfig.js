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
            'name': {
                column: {
                    sTitle: 'Name',
                    name: 'name',
                },
                columnDef: {
                	 mDataProp:'name'
                 
                }
            },
            'description': {
                column: {
                    sTitle: 'Description',
                    name: 'description',
                },
                columnDef: {
                    mDataProp:'description'
           
                }
            },
           
            'action': {
                column: {
                    sTitle: 'Action',
                },
                columnDef: {
                	render:function(data, type, row, meta) {
                		return  "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateRole('');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>  ";
                    }
                }
            },
     };
    };
    var headers = [
         's_no',         
         'name',         
         'description',
         'action'
    ];

    var RoleTable = {
        headers: headers,
        headersDef: headersDef,
        config: function(commonService) {
            return {
                sScrollY: '500px',
                iDisplayLength: 10,
                fnServerData: function(sSource, aoData, fnCallback, oSettings) {
                	var start=oSettings._iDisplayStart;
					var limit=commonService.startParams();
                      
                    oSettings.jqXHR = $.ajax({
                        type: 'get',
                        url: '/role',
                         success: function(json) {
                        	 var data = {};
                             data.sEcho = commonService.filterParams('sEcho', aoData)? commonService.filterParams('sEcho', aoData).value : 0 ;
                             data.iTotalDisplayRecords = json.length; //Display Total Records
                             data.aaData = json;
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
     * @name RoleTable
     * @module role
     * @description
     *
     *
     * @author Deepa
     * @copyright
     */
    angular
        .module('cip.role')
        .value('RoleTable', RoleTable);
}());