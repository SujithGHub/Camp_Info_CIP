(function() {
    'use strict';
    angular.module('cip',['ui.router', 'ngMaterial','ngMessages', 'ngResource','ngMask', 'cip.common', 'cip.academic', 'cip.department',
                      	'cip.standard', 'cip.section', 'cip.staff', 'cip.student', 'cip.subject', 'cip.importfile', 'cip.holiday', 'cip.attendanceAnalysis',
                    	'cip.homeWork', 'cip.examination', 'cip.result', 'cip.album', 'cip.report', 'cip.events', 'cip.payment', 'cip.blog',
                    	'cip.notification', 'cip.classifieds', 'cip.email', 'cip.sms', 'cip.attendance', 'ngCkeditor',
                    	'cip.institute', 'ngTable','cip.feedback','cip.role','cip.smtp','cip.feature','cip.reportAnalysis','cip.smsGateway','cip.paymentGateway',
                    	'cip.timeTable', 'cip.studentUpgrade', 'cip.apkDetails', 'cip.subjectAllotment', 'cip.studentsElectiveSubject', 'cip.consolidatedMark', 'cip.attendanceCorrection', 'cip.workPlan', 'angucomplete-alt', 'cip.vehicle', 'cip.feesStructure','cip.studentHomework', 'ngMap', 'cip.semester', 'cip.message','cip.chat','cip.login']).config(function($mdThemingProvider) {
            $mdThemingProvider.theme('dark-teal').primaryPalette('teal')
            .accentPalette('indigo')
            .warnPalette('red')
            .backgroundPalette('grey');;
            $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
            $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
            $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();



            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('indigo')
                .warnPalette('red')
                .backgroundPalette('grey');

            $mdThemingProvider.theme('custom')
                .primaryPalette('grey')
                .accentPalette('deep-purple')
                .warnPalette('green');
            // $mdThemingProvider.definePalette('amazingPaletteName', {
            //         '50 ': 'E0F2F1',
            //         '100 ': 'B2DFDB',
            //         '200 ': '80CBC4',
            //         '300 ': '4DB6AC',
            //         '400 ': '26A69A',
            //         '500 ': '009688',
            //         '600 ': '00897B',
            //         '700 ': '00796B',
            //         '800 ': '00695C',
            //         '900 ': '004D40',
            //         'A100 ': 'A7FFEB',
            //         'A200 ': '64FFDA',
            //         'A400 ': '1DE9B6',
            //         'A700 ': '00BFA5',
            //         'contrastDefaultColor': 'light', // whether, by default, text         (contrast)
            //         // on this palette should be dark or light
            //         'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            //             '200', '300', '400', 'A100'
            //         ],
            //         'contrastLightColors': undefined // could also specify this if default was 'dark'
            //     });
                // $mdThemingProvider.theme('custom3')
                // .primaryPalette('myTheme');
                //create yr own palett
                $mdThemingProvider.definePalette('amazingPaletteName', {
                    '50': 'ffebee',
                    '100': 'ffcdd2',
                    '200': 'ef9a9a',
                    '300': 'e57373',
                    '400': 'ef5350',
                    '500': 'f44336',
                    '600': 'e53935',
                    '700': 'd32f2f',
                    '800': 'c62828',
                    '900': 'b71c1c',
                    'A100': 'ff8a80',
                    'A200': 'ff5252',
                    'A400': 'ff1744',
                    'A700': 'd50000',
                    'contrastDefaultColor': 'light', // whether, by default, text         (contrast)
                    // on this palette should be dark or light
                    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                        '200', '300', '400', 'A100'
                    ],
                    'contrastLightColors': undefined // could also specify this if default was 'dark'
                });

                // $mdThemingProvider.theme('custom2')
                // .primaryPalette('amazingPaletteName');

                $mdThemingProvider.setDefaultTheme('dark-teal');
            });

})();
