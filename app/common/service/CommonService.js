(function() {
    'use strict';

    /**
     * @ngdoc Service
     * @name CommonService
     * @module cip.Common
     * @require $log,
     * @description
     *
     * CommonService
     *
     * @author
     * @copyright
     */

    angular
    .module('cip.common')
    .service('CommonService', CommonService);

    CommonService.$inject = [
                             '$log','SharedService'
                             ];

    function CommonService($log, sharedService) {

        var _self = this;
        
        _self.init = init;
        init();


        _self.baseApi = "/cip/api";
        /*
         * Trigger model form from controller
         */
        _self.triggerModelForm = function() {
            $("#modelForm").click();
        };

        _self.convertDateToIndianFormat = function(formatDate) {
            if(formatDate) {
                formatDate = new Date(formatDate);
                var month = (formatDate.getMonth() + 1).toString();
                var date = formatDate.getDate().toString();
                return (date.length > 1 ? date : "0" + date) + "-" + (month.length > 1 ? month : "0" + month) + "-" + (formatDate.getFullYear());
            }
        };
        
        /*
         * DataTable Default Configuration
         * Added common attributes
         */
        var TABLE_CONFIG = {
                autoWidth: true,
                bStateSave: false,
                bJQueryUI: false,
                bPaginate: true,
                bLengthChange: false,
                searching: false,
                bFilter: true,
                bSort: false,
                bInfo: true,
                bDestroy: true,
                bScrollCollapse: true,
                scroller: true,
                sScrollX: "100%",
                sScrollXInner: "100%",
                deferRender: true,
                serverSide: true,
                processing: false,
                fnConvertDateToIndianFormat: _self.convertDateToIndianFormat,
                language: {
                    sEmptyTable: "No matching records found",
                    sInfo: "Showing _START_ to _END_ of _TOTAL_ entries",
                    sInfoEmpty: "Showing 0 to 0 of 0 entries",
                    sInfoFiltered: "",
                    searchPlaceholder: 'Search Records',
                    search: '_INPUT_',
                    paginate: {
                        previous: '&lt;',
                        next:     '&gt;'
                    },
                    aria: {
                        paginate: {
                            previous: 'Previous',
                            next:     'Next'
                        }
                    }
                },
                fnServerParams : function (aoData,oSettings) {
                    if(document.getElementById("search") != null && document.getElementById("search") != undefined){
                        aoData.search.value = document.getElementById("search").value;
                    }
                    
                },
                fnDrawCallback: function(oSettings) {
                    if (oSettings._iRecordsDisplay <= this.fnSettings()._iDisplayLength) {
                      $('.dataTables_paginate').hide();
                      $('.dataTables_info').hide();
                    } else {
                    $('.dataTables_info').show();
                    $('.dataTables_paginate').show();
                  }
                }
        };

        _self.filterParams = function(text, aoData) {
            for (var i = 0; i < aoData.length; i++) {
                if (aoData[i].name === text) {
                    return aoData[i].value;
                }
            }
        };

        _self.startParams = function() {
            var limit = 10;
            return limit;
        };

        _self.authenticateHeaders = function(tableHeaders) {
            var headers = [];
            angular.forEach(tableHeaders, function(value, key) {
                value.filter(function(value) {
                    if(value==sharedService.userDetails.roles[0].name)
                        headers.push(key)
                    else if(value==sharedService.institute.instituteType)
                        headers.push(key)
                })
            }); 
            return headers;
        }

        _self.checkYearIsValid = function(fromDate, toDate){
            var fromDate = new Date(fromDate);
            var toDate = new Date(toDate);
            var diff_date =  toDate - fromDate;

            var num_years = diff_date/31536000000;
            var num_months = (diff_date % 31536000000)/2628000000;
            var num_days = ((diff_date % 31536000000) % 2628000000)/86400000;
            if(num_years<1 && num_months>8){
                return true;
            }else{
                return false;
            }
        };

        _self.convertDateFormat = function(date) {
            if(date) {
                var date = new Date(date);
                return date.getFullYear() + '-' +("0"+(date.getMonth()+1)).slice(-2) + '-'+ ("0" + date.getDate()).slice(-2);
            }
        };

        _self.convertDatePickerFormat = function(date) {
            if(date) {
                var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                    ];
                var date = new Date(date);
                return ("0" + date.getDate()).slice(-2)+"/"+(monthNames[date.getMonth()])+"/"+date.getFullYear();
            }
        };
        
        _self.isEmpty = function(value) {
            if (value) {
                return true;
            }
            return false;
        }

        _self.getConfig = function(){
            return TABLE_CONFIG;
        }

        _self.initDataTable = function(element, config) {
            var dataTable = $('#'+element).dataTable(config);
        };
        
        // Get semester by class year 
        _self.getSemesterByClassYear=function(classYearName){
            if(classYearName =="I") {
                _self.semestersLists = ["I","II"]
            }else if (classYearName =="II") {
                _self.semestersLists = ["III","IV"]
            }else if (classYearName =="III") {
                _self.semestersLists = ["V","VI"]
            }else if (classYearName =="IV") {
                _self.semestersLists = ["VII","VIII"]
            }else if (classYearName =="V") {
                _self.semestersLists = ["IX","X"]
            }
            return _self.semestersLists;
        };    
        
        /**
         * @name adjustTableWidth
         * @description
         *
         */
        _self.adjustTableWidth = function() {    
            setTimeout(function() {
                $.fn.dataTable.tables({
                    visible: true,
                    api: true
                }).columns.adjust();
            }, 300);
        };

        _self.dataTable = function(requestUrl, additionRequestParams) {
            return {
                sScrollY: '500px',
                iDisplayLength: 10,
                order: [],
                fnServerData: function(sSource, aoData, fnCallback, oSettings) {
                    var start=oSettings._iDisplayStart;
                    var limit=_self.startParams();
                    var url = _self.baseApi+requestUrl + '?start='+start+'&limit='+limit+'&searchValue='+_self.filterParams('search', aoData).value || '';
                    if(additionRequestParams) {
                        url = url +"&"+additionRequestParams;
                    }
                    if(localStorage.getItem('jwt-token')!=null) {
                    oSettings.jqXHR = $.ajax({
                        type: 'get',
                        url: url,
                        beforeSend: function(request) {
                            request.setRequestHeader("Authorization", "Bearer" + localStorage.getItem('jwt-token'));
                        },
                        success: function(json) {
                            var data                         = {};
                            data.sEcho                       = _self.filterParams('sEcho', aoData)? _self.filterParams('sEcho', aoData).value : 0 ;
                            data.iTotalDisplayRecords = json.totalCount; //Display Total Records
                            data.iTotalRecords            = json.entityList.length || 0;
                            data.aaData                     = json.entityList;
                            fnCallback(data);
                        },
                        error: function(e) {
                            fnCallback({ aaData: [] });
                        }
                    });
                }
                },
            };
        }
        
        /**
         * @param tableElm - table element
         * @param tableHeader - table headers
         * @param url - request rest api url
         * @param authenticateHeader - is validate table header for role based
         */
        _self.setTableConfig = function(tableElm, tableHeader, url, authenticateHeader, additionRequestParams) {
            
            var tableConfig = angular.extend({}, _self.getConfig(), _self.dataTable(url, additionRequestParams));

            var headers      = tableHeader.headers, 
                  headersDef = tableHeader.headersDef({});
            if(authenticateHeader) {
                    if(sharedService.userDetails.length==0 || sharedService.userDetails.roles.length === 0 || !sharedService.institute || sharedService.institute.length === 0) {
                        setTimeout(function(){_self.setTableConfig(tableElm, tableHeader, url, authenticateHeader, additionRequestParams);},100);
                        return
                    } else {
                        headers = _self.authenticateHeaders(tableHeader.headers);
                    }
            }
            tableConfig.aoColumns      = [];
            tableConfig.aoColumnDefs = [];

            function defaultColumns(col, index) {
                var column        = headersDef[col], 
                      columnDefs  = {};
                tableConfig.aoColumns.push(column.column);
                columnDefs = column.columnDef;
                columnDefs.defaultContent = '';
                columnDefs.aTargets = [index];
                tableConfig.aoColumnDefs.push(columnDefs);
            }
            _.each(headers, defaultColumns);
            _self.initDataTable(tableElm, tableConfig);
            _self.adjustTableWidth();
        };
        
        function init() {
        	$(document).ready(function() {
        		$(".fancybox").fancybox({ 
        			padding : 0,
        			prevEffect  : 'fade',
        			nextEffect  : 'fade',
        			beforeLoad : function() {
        				this.title = $(this.element).attr('caption');
        			}
        		});
        	})

        };

    }
}());
