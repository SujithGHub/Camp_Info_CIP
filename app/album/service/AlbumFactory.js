(function() {
	'use strict';

    angular
        .module('cip.album')
        .factory('AlbumFactory', AlbumFactory);

    AlbumFactory.$inject = [
        '$resource',
		'CommonService'
    ];

    function AlbumFactory($resource,commonService) {
    	
        return $resource( commonService.baseApi+'/albums/:id', {id : '@id'}, {
            $delete: {
                url:  commonService.baseApi+'/albums/delete',
                method: 'POST'
            },
            removeImage: {
                url:  commonService.baseApi+'/albums/remove',
                method: 'PUT',
            },
        	getAlbumList :{
        		url :  commonService.baseApi+'/albums/latest',
        		method:'GET'
        	},
        	getViewAlbumList :{
        		url :  commonService.baseApi+'/albums/active',
        		method:'GET',
				params : {
					start : '@start',
					limit : '@limit'
				}
			},
        	getLoginImages :{
        		url :  commonService.baseApi+'/albums/login/images',
        		method:'GET',
        		params : {
        			institute :'@institute'
        		}
        	},
        	getbackGroundImage :{
        		url :  commonService.baseApi+'/albums/background/images?institute=:type',
        		method:'GET',
        		params : {
        			type :'@type'
        		}
        	},
        	deleteBackGroundImage :{
        		url :  commonService.baseApi+'/albums/background/image',
        		method:'POST'
        	},
        	autoDeleteAlbum :{
        		url :  commonService.baseApi+'/albums/autodelete',
        		method:'POST'
        	}
        });
    }
})();