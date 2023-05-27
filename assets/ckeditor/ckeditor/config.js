/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.removePlugins = 'elementspath';
	config.resize_enabled = false;
	config.toolbarGroups = [
	            			{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
	            			{ name: 'insert', groups: [ 'insert' ] },
	            			'/',
	            			{ name: 'styles', groups: [ 'styles' ] },
	            			{ name: 'colors', groups: [ 'colors' ] },
	            			{ name: 'tools', groups: [ 'tools' ] },
	            			{ name: 'others', groups: [ 'others' ] },
	            		];
};
