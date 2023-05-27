(function() {
    'use strict';
    /**
     *@author Ashokrajan
     */
    angular
        .module('cip.common')
        .value('menus', [{
            "menu": "Home",
            "icon": "zmdi-home",
            "url": "home"
        }, {
            "menu": "Super Admin",
            "icon": "zmdi-book-image",
            "url": "",
            "subMenu": [{
                "menu": "Institute",
                "url": "institute"
            }, {
                "menu": "SMTP",
                "url": "emailConfig"
            }, {
                "menu": "Role",
                "url": "role"
            }]
        },{
            "menu": "Admin",
            "icon": "zmdi-widgets",
            "url": "",
            "subMenu": [{
                "menu": "Academic",
                "url": "academic"
            }, {
                "menu": "Department",
                "url": "department"
            }, {
                "menu": "Standard",
                "url": "standard"
            }, {
                "menu": "Section",
                "url": "section"
            }, {
                "menu": "Subject",
                "url": "subject"
            }, {
                "menu": "Staff",
                "url": "staff"
            }, {
                "menu": "Student",
                "url": "student"
            }, {
                "menu": "Import File",
                "url": "import"
            }]
        }, {
            "menu": "Holiday",
            "icon": "zmdi-run",
            "url": "holiday"
        }, {
            "menu": "My Calendar",
            "icon": "zmdi-calendar",
            "url": "mycalendar"
        }, {
            "menu": "Home Work",
            "icon": "zmdi-assignment-o",
            "url": "homework"
        }, {
            "menu": "Examination",
            "icon": "zmdi-file-text",
            "url": "exam"
        }, {
            "menu": "Result",
            "icon": "zmdi-file",
            "url": "",
            "subMenu": [{
                "menu": "View Result",
                "url": "result"
            }, {
                "menu": "Result Import",
                "url": "resultImport"
            }]
        }, {
            "menu": "Album",
            "icon": "zmdi-collection-folder-image",
            "url": "",
            "subMenu": [{
                "menu": "Album list",
                "url": "album"
            }, {
                "menu": "View Albums",
                "url": "viewalbum"
            }]
        }, {
            "menu": "Attendance",
            "icon": "zmdi-grid",
            "url": "",
            "subMenu": [{
                "menu": "Enter Attendance",
                "url": "attendance"
            }, {
                "menu": "View Attendance",
                "url": "viewattendance"
            }, {
                "menu": "Attendance Report",
                "url": "attendancereport"
            }, {
                "menu": "Attendance Analysis",
                "url": "attendanceanalysis"
            }]
        }, {
            "menu": "Report",
            "icon": "zmdi-graphic-eq",
            "url": "report"
        }, {
            "menu": "Blog",
            "icon": "zmdi-comment-edit",
            "url": "blog"
        }, {
            "menu": "Event",
            "icon": "zmdi-calendar",
            "url": "",
            "subMenu": [{
                "menu": "Event List",
                "url": "events"
            }, {
                "menu": "View Events",
                "url": "viewevents"
            }]
        }, {
            "menu": "Classifieds",
            "icon": "zmdi-shopping-cart",
            "url": "",
            "subMenu": [{
                "menu": "All Classifieds",
                "url": "classifieds"
            }, {
                "menu": "View Classifieds",
                "url": "viewclassifieds"
            }]
        }, 
        {
            "menu": "Feedback",
            "icon": "zmdi-comment-edit",
            "url": "feedback"
        },
        {
            "menu": "Marketing",
            "icon": "zmdi-menu",
            "url": "",
            "subMenu": [{
                "menu": "Email",
                "url": "",
                "childMenu": [{
                    "menu": "Send Group Email",
                    "url": "groupemail"
                }, {
                    "menu": "Send Bulk Email",
                    "url": "bulkemail"
                }, {
                    "menu": "BroadCast Email",
                    "url": "broadcastemail"
                }]
            }, {
                "menu": "Sms",
                "url": "",
                "childMenu": [{
                    "menu": "Send Group SMS",
                    "url": "groupsms"
                }, {
                    "menu": "Send Bulk SMS",
                    "url": "bulksms"
                }, {
                    "menu": "BroadCast SMS",
                    "url": "broadcastsms"
                }]
            }]
        }, {
            "menu": "Notification",
            "icon": "zmdi-notifications",
            "url": "notification"
        }, {
            "menu": "Payment",
            "icon": "zmdi-card",
            "url": "",
            "subMenu": [{
                "menu": "Make Payment",
                "url": "payment"
            },{
                "menu": "View Payment",
                "url": "viewpayment"
            }]
        }]);

})();