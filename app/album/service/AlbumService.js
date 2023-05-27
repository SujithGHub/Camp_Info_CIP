(function() {
	'use strict';

	/**
	 * @ngdoc Service
	 * @name AlbumService
	 * @module cip.album
	 * @require $log,
	 * @description
	 *
	 * AlbumService
	 *
	 * @author
	 * @copyright
	 */

	angular
	.module('cip.album')
	.service('AlbumService', AlbumService);

	AlbumService.$inject = [
	                           '$log',
	                           'CommonService',
	                           'AlbumTable',
	                           'AlbumFactory'
	                           ];

	function AlbumService($log, commonService, albumTable, albumFactory) {

		this.deleteAlbum = function(params,successCb,errorCb){
			albumFactory.$delete(params,successCb,errorCb);
		};
		this.removeImage = function(params,successCb,errorCb){
			albumFactory.removeImage(params,successCb,errorCb);
		};
		this.getAlbumById = function(params,successCb,errorCb){
			albumFactory.get(params,successCb,errorCb);
		};
		this.getAlbumList = function(params,successCb,errorCb){
			albumFactory.getAlbumList(params,successCb,errorCb);
		};
		this.getViewAlbumList = function(params,successCb,errorCb){
			albumFactory.getViewAlbumList(params,successCb,errorCb);
		};
		this.getLoginImages = function(params,successCb,errorCb){
			albumFactory.getLoginImages(params,successCb,errorCb);
		};
		this.getbackGroundImage = function(params,successCb,errorCb){
			albumFactory.getbackGroundImage(params,successCb,errorCb);
		};
		this.deleteBackGroundImage = function(params,successCb,errorCb){
			albumFactory.deleteBackGroundImage(params,successCb,errorCb);
		};
		
		this.autoDeleteAlbum = function(params,successCb,errorCb){
			albumFactory.autoDeleteAlbum(params,successCb,errorCb);
		};
		
		this.initTable=function(tableElm) {
			commonService.setTableConfig(tableElm, albumTable, '/albums');
		};
	}

}());
