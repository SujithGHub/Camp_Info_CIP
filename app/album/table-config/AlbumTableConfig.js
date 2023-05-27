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
             'album': {
				column: {
					sTitle: 'Album',
					name: 'album',
				},
				columnDef: {
					mDataProp:'name',
					bSortable: true,
					render: function(data, type, row, meta) {
						return row.name;
					}
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
					render: function(data, type, row, meta) {
						return "<button class='btn bgm-teal btn-xs' onclick=\"angular.element(this).scope().updateOrDeleteAlbum('update');$(this).addClass('selected')\"> <i class='zmdi zmdi-edit zmdi-hc-fw'></i> </button>&nbsp"+
						"<button onclick=\"angular.element(this).scope().updateOrDeleteAlbum('delete');$(this).addClass('selected')\" class='btn btn-primary btn-xs btn-delete'><i class='zmdi zmdi-delete zmdi-hc-fw' style='color: #fff;'></i></button>";
					}
				}
			},
		};
	};
	var headers = [
	               's_no',
	               'album',         
	               'status',
	               'action'
	               ];

	/**
	 * @name AlbumTable
	 * @module album
	 * @author Ashokrajan
	 * @copyright
	 */
	angular
	.module('cip.album')
	.value('AlbumTable', {headers: headers, headersDef: headersDef});
}());