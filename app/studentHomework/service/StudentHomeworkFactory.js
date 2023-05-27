(function() {
    'use strict';

    angular
        .module('cip.studentHomework')
        .factory('StudentHomeworkFactory', StudentHomeworkFactory);

    StudentHomeworkFactory.$inject = [ '$resource','CommonService' ];

    function StudentHomeworkFactory($resource,commonService) {

        return $resource( commonService.baseApi+'/StudentHomework', {}, {
            updateStatus: {
                url:  commonService.baseApi+'/homework/status',
                method: 'PUT'
            },
        });
    }
})();