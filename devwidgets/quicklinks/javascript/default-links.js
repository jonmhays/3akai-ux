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
                        "roles" : [ "ALL" ]
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
                        "roles" : [ "Faculty", "Students" ]
                    },
                    {
                        "id": "classroom_tech",
                        "name": "Classroom Technology",
                        "url": "http://ets.berkeley.edu/classroom-technology/",
                        "popup_description": "Classroom technology, help and resources.",
                        "roles" : [ "Faculty" ]
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
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "schedule_planning",
                        "name": "Schedule Planning",
                        "url": "https://schedulebuilder.berkeley.edu/",
                        "popup_description": "Plan your classes.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "teaching_resources",
                        "name": "Teaching Resources",
                        "url": "http://teaching.berkeley.edu/teaching.html",
                        "popup_description": "Planning your class and thinking about teaching.",
                        "roles" : [ "Faculty" ]
                    },
                    {
                        "id": "tele_bears",
                        "name": "Tele-BEARS",
                        "url": "http://telebears.berkeley.edu",
                        "popup_description": "Register for classes.",
                        "roles" : [ "Students" ]
                    },
                    {
                        "id": "uc_extension",
                        "name": "UC Extension",
                        "url": "http://extension.berkeley.edu/",
                        "popup_description": "Professional and Continuing Education.",
                        "roles" : [ "ALL" ]
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
                        "id": "calmail",
                        "name": "CalMail",
                        "url": "http://calmail.berkeley.edu",
                        "popup_description": "Campus email system.",
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
                        "id": "directory",
                        "name": "Directory",
                        "url": "https://calnet.berkeley.edu/directory/",
                        "popup_description": "Search For People at UC Berkeley.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "emp_benefits",
                        "name": "Employee Benefits - At Your Service",
                        "url": "http://atyourservice.ucop.edu",
                        "popup_description": "Search For People at UC Berkeley.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "events_berkeley",
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
                    },
                    {
                        "id": "human_resources",
                        "name": "Human Resources",
                        "url": "http://hrweb.berkeley.edu/",
                        "popup_description": "Human Resources.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "jobs",
                        "name": "Job Listings",
                        "url": "http://jobs.berkeley.edu/",
                        "popup_description": "Job Listings for student, staff and academic positions.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "payroll",
                        "name": "Payroll Services",
                        "url": "http://controller.berkeley.edu/payroll/",
                        "popup_description": "Campus payroll office: earnings statements, payroll forms, online reporting and resources.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "staff_ombuds",
                        "name": "Staff Ombuds",
                        "url": "http://staffombuds.berkeley.edu/",
                        "popup_description": "The Staff Ombuds Office is an independent department that provides strictly confidential and informal conflict resolution and problem-solving services for all Staff, Non-Senate Academics, and Faculty who perform management functions.",
                        "roles" : [ "Faculty", "Staff" ]
                    },
                    {
                        "id": "student_ombuds",
                        "name": "Student Ombuds",
                        "url": "http://campuslife.berkeley.edu/ombuds",
                        "popup_description": "Assistance sorting through a campus-related conflict or concern.",
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
                        "id": "care_services",
                        "name": "CARE Services",
                        "url": "http://uhs.berkeley.edu/facstaff/care/",
                        "popup_description": "CARE Services is the campus faculty and staff assistance program providing free, confidential problem assessment and referral for UC Berkeley faculty and staff.",
                        "roles" : [ "Faculty", "Staff" ]
                    },
                    {
                        "id": "emergency_information",
                        "name": "Emergency information",
                        "url": " https://emergency.berkeley.edu/",
                        "popup_description": "Go-to site for emergency response information.",
                        "roles" : [ "Faculty", "Staff" ]
                    },
                    {
                        "id": "graduate_assembly",
                        "name": "Graduate Assembly",
                        "url": "http://ga.berkeley.edu",
                        "popup_description": "Graduate student government",
                        "roles" : [ "Students" ]
                    },
                    {
                        "id": "uhs",
                        "name": "Health Services - Tang Center",
                        "url": "http://uhs.berkeley.edu",
                        "popup_description": "Campus healthcare.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "parking_and_transportation",
                        "name": "Parking & Transportation",
                        "url": "http://pt.berkeley.edu/park",
                        "popup_description": "Parking lots, transportation, car sharing, etc.",
                        "roles" : [ "ALL" ]
                    },
                    {
                        "id": "police_and_safety",
                        "name": "Police & Safety",
                        "url": "http://police.berkeley.edu",
                        "popup_description": "Police programs and services, forms, safety information, comments and questions.",
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
