define(function() {
    return {
        "userSectionIndex" : 3,
        "sections" : [
            {
                "label" : "Academic",
                "links" : [
                    {
                        "id": "academic_calendars",
                        "name": "Academic Calendar",
                        "url": "http://registrar.berkeley.edu/CalendarDisp.aspx?terms=current",
                        "popup_description": "Academic Calendars.",
                        "roles" : [ "Faculty", "Students" ]
                    },
                    {
                        "id"   : "bspace",
                        "name" : "bSpace",
                        "url" : "http://bspace.berkeley.edu",
                        "popup_description": "Homework assignments, lecture slides, syllabi, and class resources.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id"   : "campus_bookstore",
                        "name" : "Campus Bookstore",
                        "url"  : "http://www.bkstr.com/webapp/wcs/stores/servlet/StoreCatalogDisplay?storeId=10433",
                        "popup_description": "Textbooks and more.",
                        "roles" : [ "Students" ]
                    },
                    {
                        "id": "course_catalog",
                        "name": "Course Catalog",
                        "url": "http://sis.berkeley.edu/catalog/gcc_search_menu",
                        "popup_description": "Detailed course descriptions.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id"   : "dars",
                        "name" : "DARS",
                        "url"  : "https://marin.berkeley.edu/darsweb/servlet/ListAuditsServlet",
                        "popup_description": "Degree requirements and track progress.",
                        "roles" : [ "Staff", "Students" ]
                    },
                    {
                        "id": "decal",
                        "name": "DeCal Courses",
                        "url": "http://www.decal.org",
                        "popup_description": "Catalog of student-led courses.",
                        "roles" : [ "Students" ]
                    },
                    {
                        "id": "library",
                        "name": "Library",
                        "url": "http://www.lib.berkeley.edu",
                        "popup_description": "Search the UC library system.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "class_schedule",
                        "name": "Schedule of Classes",
                        "url": "http://schedule.berkeley.edu",
                        "popup_description": "Classes offerings by semester.",
                        "roles" : [ "Faculty", "Students" ]
                    },
                    {
                        "id": "schedule_planning",
                        "name": "Schedule Planning",
                        "url": "https://schedulebuilder.berkeley.edu/",
                        "popup_description": "Plan your classes.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "tele_bears",
                        "name": "Tele-BEARS",
                        "url": "http://telebears.berkeley.edu",
                        "popup_description": "Register for classes.",
                        "roles" : [ "Students" ]
                    }
                ]
            },
            {
                "label" : "Administrative",
                "links" : [
                    {
                        "id": "bear_facts",
                        "name": "Bear Facts",
                        "url": "https://bearfacts.berkeley.edu/bearfacts/student/studentMain.do?bfaction=welcome",
                        "popup_description": "Academic record, grades & transcript, bill, degree audit, loans, SLR & personal info.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "bmail",
                        "name": "bMail",
                        "url": "http://calmail.berkeley.edu",
                        "popup_description": "Email.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "career_center",
                        "name": "Career Center",
                        "url": "http://career.berkeley.edu",
                        "popup_description": "Cal jobs, internships & career counseling.",
                        "roles" : [ "Students" ]
                    },
                    {
                        "id": "eveents_berkeley",
                        "name": "Events Berkeley",
                        "url": "http://events.berkeley.edu",
                        "popup_description": "Campus events calendar.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "finaid",
                        "name": "Financial Aid",
                        "url": "http://students.berkeley.edu/finaid",
                        "popup_description": "Student financial aid options and select scholarships.",
                        "roles" : [ "Students" ]
                    }
                ]
            },
            {
                "label" : "Campus Life",
                "links" : [
                    {
                        "id": "asuc",
                        "name": "ASUC",
                        "url": "http://www.asuc.org",
                        "popup_description": "Student government.",
                        "roles" : [ "Students" ]
                    },
                    {
                        "id": "atoz_sites",
                        "name": "Berkeley Sites (A-Z)",
                        "url": "http://www.berkeley.edu/a-z/a.shtml",
                        "popup_description": "Navigating UC Berkeley.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "cal1card",
                        "name": "Cal-1-Card",
                        "url": "http://services.housing.berkeley.edu/c1c/static/aboutc1c.htm",
                        "popup_description": "Identification card for students, staff and faculty.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "caldining",
                        "name": "CalDining",
                        "url": "http://caldining.berkeley.edu",
                        "popup_description": "Campus dining facilities.",
                        "roles" : [ "Students" ]
                    },
                    {
                        "id": "campus_map",
                        "name": "Campus Map",
                        "url": "http://berkeley.edu/map",
                        "popup_description": "Locate campus buildings.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "graduate_assembly",
                        "name": "Graduate Assembly",
                        "url": "http://ga.berkeley.edu",
                        "popup_description": "Graduate student government",
                        "roles" : [ "Students" ]
                    },
                    {
                        "id": "parking_and_transportation",
                        "name": "Parking & Transportation",
                        "url": "http://pt.berkeley.edu/park",
                        "popup_description": "Parking lots, transportation, car sharing, etc.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "public_service",
                        "name": "Public Service",
                        "url": "http://calcorps.berkeley.edu",
                        "popup_description": "On and off campus community service engagement.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "rsf",
                        "name": "Recreational Sports Facility",
                        "url": "http://www.recsports.berkeley.edu",
                        "popup_description": "Sports and fitness programs.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "rescomp",
                        "name": "Residential Computing",
                        "url": "http://rescomp.berkeley.edu",
                        "popup_description": "Computer and network services for resident students.",
                        "roles" : [ "Students" ]
                    },
                    {
                        "id": "resource_guide",
                        "name": "Resource Guide for Students",
                        "url": "http://resource.berkeley.edu",
                        "popup_description": "Comprehensive campus guide for students.",
                        "roles" : [ "Students" ]
                    },

                    {
                        "id": "student_groups",
                        "name": "Student Groups and Programs",
                        "url": "http://students.berkeley.edu/osl",
                        "popup_description": "Search for and join campus student organizations.",
                        "roles" : [ "Students" ]
                    },

                    {
                        "id": "student_services",
                        "name": "Student Services",
                        "url": "http://www.berkeley.edu/students",
                        "popup_description": "Student services and programs.",
                        "roles" : [ "Students" ]
                    },
                    {
                        "id": "uhs",
                        "name": "UHS - Tang Center",
                        "url": "http://uhs.berkeley.edu",
                        "popup_description": "Campus healthcare.",
                        "roles" : [ "ALL" ]
                    }
                ]
            },
            {
                "label" : "My Links",
                "links" : [],
                "isEditable" : true,
                "activeSection" : 0
            }
        ]
    };
});
