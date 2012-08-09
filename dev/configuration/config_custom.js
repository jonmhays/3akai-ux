/*
 * Licensed to the Sakai Foundation (SF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The SF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
define(["config/config", "config/env"], function(config) {

    // This is our custom CAS log in information.
    config.Authentication.internal = config.isDev; // for CalCentral this is always false because CAS is always on
    config.Authentication.internalAndExternal = config.isDev;
    config.Authentication.external = [
        {
          label: "Login using your CalNet ID",
          login_btn: "LOGIN_BTN",
          url: "/system/sling/cas/login?resource=/me",
          description: "CAS_NOTE"
        }
    ];
    config.Authentication.allowInternalAccountCreation = false;
    config.Authentication.hideLoginOn = [
        "/dev/create_new_account.html"
    ];
    config.allowPasswordChange = false;

    // Extend the set of enabled dashboard widgets(so they can be re-added after user removal)
    // This may go away in 1.4 - duplicative with existing widget configs
    // config.enabledDashboardWidgets.push("walktime", "quicklinks", "mytasks", "myevents");

    // Show quicklinks dashboard widget by default for new users
    config.defaultprivstructure["${refid}0"]["${refid}5"].dashboard.columns.column3.push({
        "uid": "id63754673110789",
        "visible": "block",
        "name": "quicklinks"
    });

    // Show walktime dashboard widget by default for new users
    config.defaultprivstructure["${refid}0"]["${refid}5"].dashboard.columns.column1.push({
        "uid": "id46750934593210789",
        "visible": "block",
        "name": "walktime",
        "personalportal": true,
        "deletable":true
    });

    /*
    Temporarily using this approach to disabling the carousel - may change in future.
     */
    enabledCarousel: false;


    /*
    Inject DynamicLists and Notifications into menus;
    provide default JSON template for same.
     */

    // My notifications
    config.defaultprivstructure.structure0.notifications = {
        "_title": "__MSG__MY_NOTIFICATIONS__",
        "_ref": "id1165301022",
        "_order": 3,
        "_canEdit": true,
        "_canSubedit": true,
        "_nonEditable": true,
        "drafts": {
            "_ref": "id1307490615",
            "_order": 0,
            "_title": "Drafts",
            "_canEdit": true,
            "_canSubedit": true,
            "_nonEditable": true
        },
        "queue": {
            "_ref": "id1307490615",
            "_order": 1,
            "_title": "Queue",
            "_canEdit": true,
            "_canSubedit": true,
            "_nonEditable": true
        },
        "archive": {
            "_ref": "id1307490615",
            "_order": 2,
            "_title": "Archive",
            "_canEdit": true,
            "_canSubedit": true,
            "_nonEditable": true
        },
        "trash": {
            "_ref": "id1307490615",
            "_order": 3,
            "_title": "Trash",
            "_canEdit": true,
            "_canSubedit": true,
            "_nonEditable": true
        }
    };

    // Generates Notifications widget for use in Content Authoring
    config.defaultprivstructure.id1307490615 = {
        'rows': [{
            'id': 'id9583409539834883',
            'columns': [{
                'width': 1,
                'elements': [{
                    'id': 'idid1307490671',
                    'type': 'groupnotificationmanager'
                }, {
                    'id': 'id1307666089',
                    'type': 'composenotification'
                }]
            }]
        }]
    };


    // My dynamic lists (left nav)
    config.defaultprivstructure.structure0.dynlists = {
            "_title": "__MSG__MY_DYNAMIC_LISTS__",
            "_ref": "id1307386414",
            "_order": 4,
            "_canEdit": true,
            "_canSubedit": true,
            "_nonEditable": true
    };


    // Generates Dynamic Lists widget for use in Content Authoring
    config.defaultprivstructure.id1307386414 = {
        'rows': [{
            'id': 'id8965114838384',
            'columns': [{
                'width': 1,
                'elements': [{
                    'id': 'id1307386502',
                    'type': 'dynamiclistmanager'
                }, {
                    'id': 'id1307390214',
                    'type': 'dynamiclisteditor'
                }]
            }]
        }]
    };


    /*
     * These links are displayed in the 403 and 404 error pages.
     */
    config.ErrorPage = {
        Links: {
            whatToDo: [
                {
                    "title": "EXPLORE_MYBERKELEY",
                    "url": "/"
                },
                {
                    "title": "BROWSE_MYBERKELEY_CATEGORIES",
                    "url": "/categories"
                },
                {
                    "title": "GO_TO_BERKELEY_EDU",
                    "url": "http://berkeley.edu/"
                }
            ],
            getInTouch: [
                {
                    "title": "SEND_US_YOUR_FEEDBACK",
                    "url": "http://ets.berkeley.edu/calcentral-feedback"
                },
                {
                    "title": "CONTACT_SUPPORT",
                    "url": "mailto:portal@berkeley.edu"
                }
            ]
        }
    };

    // so that user gets redirected to CAS logout
    config.followLogoutRedirects = true;

    // remove the SIGN UP feature for anonymous users
    delete(config.Navigation[4]);

    config.Navigation[0].label = "ME";

    /* Override default access permissions for content, documents, and collections
     **  content = files added to CalCentral
     **  documents = documents created in CalCentral
     */

    config.Permissions.Content = {
        'defaultaccess': 'private' // public, everyone or private
    };

    config.Permissions.Documents = {
        'defaultaccess': 'private' // public, everyone or private
    };

    config.Permissions.Collections = {
        'defaultaccess': 'private' // public, everyone or private
    };

    /* CalCentral specific footer links */
    config.Footer.leftLinks = [
        {
            "title": "__MSG__HELP__",
            "href": "/~Help-and-Support"
        }, {
            "title": "__MSG__FEEDBACK__",
            "href": "http://ets.berkeley.edu/calcentral-feedback",
            "newWindow": true
        }, {
            "title": "__MSG__ACKNOWLEDGEMENTS__",
            "href": "/acknowledgements"
        //}, {
        //    "title": "__MSG__SUGGEST_AN_IMPROVEMENT__",
        //    "href": "http://sakaioae.idea.informer.com/",
        //    "newWindow": true
        }
    ];

    // Add My Notification and My Dynamic Lists to TOP Navigation
    // These are suppressed for non-advisers in topnavigation.js
    config.Navigation[0].subnav.splice(2,0,
        {
            "url": "/me#l=notifications/drafts",
            "id": "subnavigation_notifications_link",
            "label": "MY_NOTIFICATIONS",
            "requiresAdviserMembership": true
        }
    );
        config.Navigation[0].subnav.splice(3,0,
        {
            "url": "/me#l=dynlists",
            "id": "subnavigation_dynlists_link",
            "label": "MY_DYNAMIC_LISTS",
            "requiresAdviserMembership": true
        }
    );

    /* REWRITE config.Directory
     * shoving the OAE's SUBJECT directory into the middle of our directory */

    /* Grab the current OAE subject categories */
    var oaeSubjectDirectory = config.Directory;

    /* DIVIDERS FOR SUBJECTS */
    var calcSubjectDirectoryDiv = {
        by_subject_divider: {
            divider: true,
            title: "Subjects",
            cssClass: "myb-cat-by-subject"
        }
    };

    /* COLLEGES AND SCHOOLS */
    var calcCollegeDirectory = {
        by_org_divider: {
            divider: true,
            title: "Colleges & Schools",
            cssClass: "myb-cat-by-colleges"
        },
        collegeoflettersscienceartshumanities: {
            title_prefix: "College of Letters & Science",
            title: "Arts & Humanities",
            children: {
                scienceartshumanitiesancienthistorymediterraneanarchaeology: {
                    title: "Ancient History & Mediterranean Archaeology"
                },
                scienceartshumanitiesarthistory: {
                    title: "Art History"
                },
                scienceartshumanitiesartpractice: {
                    title: "Art Practice"
                },
                scienceartshumanitiesartsresearchcenter: {
                    title: "Arts Research Center"
                },
                scienceartshumanitiesberkeleylanguagecenter: {
                    title: "Berkeley Language Center"
                },
                scienceartshumanitiesberkeleywarcrimesstudiescenter: {
                    title: "Berkeley War Crimes Studies Center"
                },
                scienceartshumanitiesbuddhiststudies: {
                    title: "Buddhist Studies"
                },
                scienceartshumanitiescelticstudies: {
                    title: "Celtic Studies"
                },
                scienceartshumanitiescenterfornewmusicaudiotechnologies: {
                    title: "Center for New Music & Audio Technologies"
                },
                scienceartshumanitiesclassics: {
                    title: "Classics"
                },
                scienceartshumanitiescomparativeliterature: {
                    title: "Comparative Literature"
                },
                scienceartshumanitiesdutchstudies: {
                    title: "Dutch Studies"
                },
                scienceartshumanitieseastasianlanguagescultures: {
                    title: "East Asian Languages & Cultures"
                },
                scienceartshumanitiesenglish: {
                    title: "English"
                },
                scienceartshumanitiesfilmmedia: {
                    title: "Film & Media"
                },
                scienceartshumanitiesfrench: {
                    title: "French"
                },
                scienceartshumanitiesgerman: {
                    title: "German"
                },
                scienceartshumanitiesitalianstudies: {
                    title: "Italian Studies"
                },
                scienceartshumanitiesjewishstudies: {
                    title: "Jewish Studies"
                },
                scienceartshumanitiesmedievalstudies: {
                    title: "Medieval Studies"
                },
                scienceartshumanitiesmusic: {
                    title: "Music"
                },
                scienceartshumanitiesneareasternstudies: {
                    title: "Near Eastern Studies"
                },
                scienceartshumanitiesphilosophy: {
                    title: "Philosophy"
                },
                scienceartshumanitiesrhetoric: {
                    title: "Rhetoric"
                },
                scienceartshumanitiesromancelanguagesliterature: {
                    title: "Romance Languages & Literature"
                },
                scienceartshumanitiesscandinavian: {
                    title: "Scandinavian"
                },
                scienceartshumanitiesslaviclanguagesandliterature: {
                    title: "Slavic Languages and Literature"
                },
                scienceartshumanitiessouthsoutheastasianstudies: {
                    title: "South & Southeast Asian Studies"
                },
                scienceartshumanitiesspanishportugese: {
                    title: "Spanish & Portugese"
                },
                scienceartshumanitiestheaterdanceperformancestudies: {
                    title: "Theater, Dance & Performance Studies"
                },
                scienceartshumanitiestownsendcenterforthehumanities: {
                    title: "Townsend Center for the Humanities"
                }
            }

        },
        collegeofletterssciencebiologicalsciences: {
            title_prefix: "College of Letters & Science",
            title: "Biological Sciences",
            children: {
                sciencebiologicalsciencesbiochemistrybiophysicsstructuralbiology: {
                    title: "Biochemistry, Biophysics & Structural Biology"
                },
                sciencebiologicalsciencescelldevelopmentalbiology: {
                    title: "Cell & Developmental Biology"
                },
                sciencebiologicalsciencesgeneticsgeonomicsdevelopment: {
                    title: "Genetics, Geonomics & Development"
                },
                sciencebiologicalsciencesimmunologypathogenesis: {
                    title: "Immunology & Pathogenesis"
                },
                sciencebiologicalsciencesintegrativebiology: {
                    title: "Integrative Biology"
                },
                sciencebiologicalsciencesmolecularandcellbiology: {
                    title: "Molecular and Cell Biology"
                },
                sciencebiologicalsciencesneurobiology: {
                    title: "Neurobiology"
                },
                sciencebiologicalsciencesphysicaleducation: {
                    title: "Physical Education"
                }
            }
        },
        haasschoolofbusiness: {
            title_prefix: "Haas School of",
            title: "Business",
            children: {
                haasaccounting: {
                    title: "Accounting"
                },
                haasbusinesspublicpolicy: {
                    title: "Business & Public Policy"
                },
                haaseconomicanalysispolicy: {
                    title: "Economic Analysis & Policy"
                },
                haasfinance: {
                    title: "Finance"
                },
                haasmanagementoforganizations: {
                    title: "Management of Organizations"
                },
                haasmarketing: {
                    title: "Marketing"
                },
                haasoperationsinformationtechnologymanagement: {
                    title: "Operations & Information Technology Management"
                },
                haasrealestate: {
                    title: "Real Estate"
                }
            }
        },
        collegeofchemistry: {
            title_prefix: "College of",
            title: "Chemistry",
            children: {
                collegeofchemistrychemicalbiomolecularengineering: {
                    title: "Chemical & Biomolecular Engineering"
                },
                collegeofchemistrychemistry: {
                    title: "Chemistry"
                },
                collegeofchemistrymaterialsscienceengineering: {
                    title: "Materials Science & Engineering"
                },
                collegeofchemistrynuclearengineering: {
                    title: "Nuclear Engineering"
                }
            }
        },
        graduateschoolofeducation: {
            title_prefix: "Graduate School of",
            title: "Education",
            children: {
                graduateschoolofeducationeducation: {
                    title: "Education"
                },
                graduateschoolofeducationsciencemathematicseducation: {
                    title: "Science & Mathematics Education"
                }
            }
        },
        collegeofengineering: {
            title_prefix: "College of",
            title: "Engineering",
            children: {
                collegeofengineeringappliedsciencetechnology: {
                    title: "Applied Science & Technology"
                },
                collegeofengineeringbioengineering: {
                    title: "Bioengineering"
                },
                collegeofengineeringcivilenvironmentalengineering: {
                    title: "Civil & Environmental Engineering"
                },
                collegeofengineeringcomputationalgenomicbiology: {
                    title: "Computational & Genomic Biology "
                },
                collegeofengineeringcomputerscience: {
                    title: "Computer Science"
                },
                collegeofengineeringelectricalengineering: {
                    title: "Electrical Engineering"
                },
                collegeofengineeringengineering: {
                    title: "Engineering"
                },
                collegeofengineeringindustrialengineeringoperationsresearch: {
                    title: "Industrial Engineering & Operations Research"
                },
                collegeofengineeringmaterialsscienceengineering: {
                    title: "Materials Science & Engineering "
                },
                collegeofengineeringmechanicalengineering: {
                    title: "Mechanical Engineering"
                },
                collegeofengineeringnanoscalescienceengineering: {
                    title: "Nanoscale Science & Engineering"
                },
                collegeofengineeringoceanengineering: {
                    title: "Ocean Engineering"
                }
            }
        },
        collegeofenvironmentaldesign: {
            title_prefix: "College of",
            title: "Environmental Design",
            children: {
                cedarchitecture: {
                    title: "Architecture"
                },
                cedcityregionalplanning: {
                    title: "City & Regional Planning"
                },
                cedenvironmentaldesign: {
                    title: "Environmental Design"
                },
                cedlandscapearchitecture: {
                    title: "Landscape Architecture"
                },
                cedvisualstudies: {
                    title: "Visual Studies"
                }
            }
        },
        schoolofinformation: {
            title_prefix: "School of",
            title: "Information",
            children: {
                schoolofinformationhumancomputerinteraction: {
                    title: "Human-Computer Interaction"
                },
                schoolofinformationinformationcommunicationtechnologiesdevelopment: {
                    title: "Information & Communication Technologies & Development"
                },
                schoolofinformationinformationeconomicspolicy: {
                    title: "Information Economics & Policy"
                },
                schoolofinformationinformationlawpolicy: {
                    title: "Information Law & Policy"
                },
                schoolofinformationinformationorganizationretrieval: {
                    title: "Information Organization & Retrieval"
                },
                schoolofinformationinformationsystemsdesign: {
                    title: "Information Systems Design"
                },
                schoolofinformationsocialaspectsofinformation: {
                    title: "Social Aspects of Information"
                }
            }
        },
        interdepartmentalgraduateprograms: {
            title: "Interdepartmental Graduate Programs",
            children: {
                interdepartmentalgraduateprogramscomparativebiochemistry: {
                    title: "Comparative Biochemistry"
                },
                interdepartmentalgraduateprogramsenergyresourcesgroup: {
                    title: "Energy & Resources Group"
                }
            }
        },
        graduateschoolofjournalism: {
            title_prefix: "Graduate School of",
            title: "Journalism",
            children: {
                jschoolbusinessreporting: {
                    title: "Business Reporting"
                },
                jschooldocumentary: {
                    title: "Documentary"
                },
                jschoolenvironmentalsciencejournalism: {
                    title: "Environmental & Science Journalism"
                },
                jschoolinternationalreporting: {
                    title: "International Reporting"
                },
                jschoolinvestigativereporting: {
                    title: "Investigative Reporting"
                },
                jschoolmagazine: {
                    title: "Magazine"
                },
                jschoolnewmedia: {
                    title: "New Media"
                },
                jschoolnewspaper: {
                    title: "Newspaper"
                },
                jschoolphotojournalism: {
                    title: "Photojournalism"
                },
                jschoolpoliticalreporting: {
                    title: "Political Reporting"
                },
                jschoolradio: {
                    title: "Radio"
                },
                jschooltelevision: {
                    title: "Television"
                }
            }
        },
        schooloflaw: {
            title_prefix: "School of",
            title: "Law",
            children: {
                schooloflawbusinesslaweconomics: {
                    title: "Business, Law & Economics"
                },
                schooloflawcomparativelegalstudies: {
                    title: "Comparative Legal Studies"
                },
                schooloflawenvironmentallaw: {
                    title: "Environmental Law"
                },
                schooloflawinternationallegalstudies: {
                    title: "International Legal Studies"
                },
                schooloflawlaw: {
                    title: "Law"
                },
                schooloflawlawtechnology: {
                    title: "Law & Technology"
                },
                schooloflawlegalstudies: {
                    title: "Legal Studies"
                },
                schooloflawsocialjustice: {
                    title: "Social Justice"
                }
            }
        },
        collegeofletterssciencemathematicalphysicalsciences: {
            title_prefix: "College of Letters & Science",
            title: "Mathematical & Physical Sciences",
            children: {
                mathematicalphysicalsciencesastronomy: {
                    title: "Astronomy"
                },
                mathematicalphysicalsciencesearthplanetaryscience: {
                    title: "Earth & Planetary Science"
                },
                mathematicalphysicalsciencesphysics: {
                    title: "Physics"
                },
                mathematicalphysicalsciencesstatistics: {
                    title: "Statistics"
                }
            }
        },
        collegeofnaturalresources: {
            title_prefix: "College of",
            title: "Natural Resources",
            children: {
                cnragriculturalresourceeconomics: {
                    title: "Agricultural & Resource Economics"
                },
                cnrenvironmentalsciencepolicymanagement: {
                    title: "Environmental Science Policy & Management"
                },
                cnrenvironmentaleconomicspolicy: {
                    title: "Environmental Economics & Policy"
                },
                cnrnaturalresources: {
                    title: "Natural Resources"
                },
                cnrnutritionalsciencestoxicology: {
                    title: "Nutritional Sciences & Toxicology"
                },
                cnrplantmicrobialbiology: {
                    title: "Plant & Microbial Biology"
                }
            }
        },
        schoolofoptometry: {
            title_prefix: "School of",
            title: "Optometry",
            children: {
                schoolofoptometryoptometry: {
                    title: "Optometry"
                },
                schoolofoptometryvisionscience: {
                    title: "Vision Science"
                }
            }
        },
        schoolofpublichealth: {
            title_prefix: "School of",
            title: "Public Health",
            children: {
                schoolofpublichealthbiostatistics: {
                    title: "Biostatistics"
                },
                schoolofpublichealthenvironmentalhealthsciences: {
                    title: "Environmental Health Sciences"
                },
                schoolofpublichealthepidemiology: {
                    title: "Epidemiology"
                },
                schoolofpublichealthhealthmedicalservices: {
                    title: "Health & Medical Services"
                },
                schoolofpublichealthhealthsocialbehavior: {
                    title: "Health & Social Behavior"
                },
                schoolofpublichealthhealthpolicymanagement: {
                    title: "Health Policy & Management"
                },
                schoolofpublichealthhealthservicespolicyanalysis: {
                    title: "Health Services & Policy Analysis"
                },
                schoolofpublichealthinfectiousdiseasevaccinology: {
                    title: "Infectious Disease & Vaccinology"
                },
                schoolofpublichealthmaternalchildhealth: {
                    title: "Maternal & Child Health"
                },
                schoolofpublichealthpublichealth: {
                    title: "Public Health"
                },
                schoolofpublichealthpublichealthnutrition: {
                    title: "Public Health Nutrition"
                }
            }
        },
        goldmanschoolofpublicpolicy: {
            title_prefix: "Goldman School of",
            title: "Public Policy",
            children: {
                publicpolicypublicpolicy: {
                    title: "Public Policy"
                }
            }
        },
        collegeofletterssciencesocialsciences: {
            title_prefix: "College of Letters & Science",
            title: "Social Sciences",
            children: {
                sciencesocialsciencesafricanamericanstudies: {
                    title: "African American Studies"
                },
                sciencesocialsciencesanthropology: {
                    title: "Anthropology"
                },
                sciencesocialsciencesdemography: {
                    title: "Demography"
                },
                sciencesocialscienceseconomics: {
                    title: "Economics"
                },
                sciencesocialsciencesethnicstudies: {
                    title: "Ethnic Studies"
                },
                sciencesocialsciencesgenderandwomensstudies: {
                    title: "Gender and Women's Studies"
                },
                sciencesocialsciencesgeography: {
                    title: "Geography"
                },
                sciencesocialscienceshistory: {
                    title: "History"
                },
                sciencesocialscienceslinguistics: {
                    title: "Linguistics"
                },
                sciencesocialsciencespoliticalscience: {
                    title: "Political Science"
                },
                sciencesocialsciencespsychology: {
                    title: "Psychology"
                },
                sciencesocialsciencessociology: {
                    title: "Sociology"
                }
            }
        },
        schoolofsocialwelfare: {
            title_prefix: "School of",
            title: "Social Welfare",
            children: {
                schoolofsocialwelfaresocialwelfare: {
                    title: "Social Welfare"
                }
            }
        },
        undergraduateinterdisciplinarystudies: {
            title: "Undergraduate & Interdisciplinary Studies",
            children: {
                undergraduateinterdisciplinarystudiesamericanstudies: {
                    title: "American Studies"
                },
                undergraduateinterdisciplinarystudiesasianstudies: {
                    title: "Asian Studies"
                },
                undergraduateinterdisciplinarystudiescognitivescience: {
                    title: "Cognitive Science"
                },
                undergraduateinterdisciplinarystudiescreativewriting: {
                    title: "Creative Writing"
                },
                undergraduateinterdisciplinarystudiescollegewritingprogram: {
                    title: "College Writing Program"
                },
                undergraduateinterdisciplinarystudiesdevelopmentstudies: {
                    title: "Development Studies"
                },
                undergraduateinterdisciplinarystudiesdisabilitystudies: {
                    title: "Disability Studies"
                },
                undergraduateinterdisciplinarystudiesenvironmentalsciences: {
                    title: "Environmental Sciences"
                },
                undergraduateinterdisciplinarystudiesinterdisciplinarystudies: {
                    title: "Interdisciplinary Studies"
                },
                undergraduateinterdisciplinarystudieslatinamericanstudies: {
                    title: "Latin American Studies"
                },
                undergraduateinterdisciplinarystudiesmediastudies: {
                    title: "Media Studies"
                },
                undergraduateinterdisciplinarystudiesmiddleeasternstudies: {
                    title: "Middle Eastern Studies"
                },
                undergraduateinterdisciplinarystudiesmilitaryaffairs: {
                    title: "Military Affairs"
                },
                undergraduateinterdisciplinarystudiespeaceconflictstudies: {
                    title: "Peace & Conflict Studies"
                },
                undergraduateinterdisciplinarystudiespoliticaleconomyofindustrialsocieties: {
                    title: "Political Economy of Industrial Societies"
                },
                undergraduateinterdisciplinarystudiesreligiousstudies: {
                    title: "Religious Studies"
                }
            }
        }
    };

    /* CAMPUS LIFE */
    var calcCampusDirectory = {
        by_campus_divider: {
            divider: true,
            title: "Campus Life",
            cssClass: "myb-cat-by-campuslife"
        },
        campusacademic: {
            title: "Academic",
            children: {}
        },
        campusarts: {
            title: "Arts",
            children: {}
        },
        campusculture: {
            title: "Culture",
            children: {}
        },
        campuspolitical: {
            title: "Political",
            children: {}
        },
        campusprofessional: {
            title: "Professional",
            children: {}
        },
        campussport: {
            title: "Sport",
            children: {}
        },
        campusreligious: {
            title: "Religious",
            children: {}
        },
        campusservice: {
            title: "Service",
            children: {}
        }
    };

    /* Concatenate the above directories together */
    config.Directory = $.extend({}, calcCollegeDirectory, calcSubjectDirectoryDiv, oaeSubjectDirectory, calcCampusDirectory);

    /*
     * CalCentral Custom Profile settings
     * CalCentral uses different fields and field settings for the Personal Profile than OAE
     * "label": the internationalizable message for the entry label in HTML
     * "required": {Boolean} Whether the entry is compulsory or not
     * "display": {Boolean} Show the entry in the profile or not
     * "editable": {Boolean} Whether or not the entry is editable
     * For a date entry field use "date" as the type for MM/dd/yyyy and "dateITA" as the type for dd/MM/yyyy
     *
     */

    config.Profile.configuration.defaultConfig = {
        "basic": {
            "label": "__MSG__PROFILE_BASIC_LABEL__",
            "required": true,
            "display": true,
            "access": "everybody",
            "modifyacl": false,
            "order": 0,
            "elements": {
                "firstName": {
                    "label": "__MSG__PROFILE_BASIC_FIRSTNAME_LABEL__",
                    "required": true,
                    "display": true,
                    "limitDisplayLength": 50,
                    "editable": false
                },
                "lastName": {
                    "label": "__MSG__PROFILE_BASIC_LASTNAME_LABEL__",
                    "required": true,
                    "display": true,
                    "limitDisplayLength": 50,
                    "editable": false
                },
                "picture": {
                    "label": "__MSG__PROFILE_BASIC_PICTURE_LABEL__",
                    "required": false,
                    "display": false
                },
                "preferredName": {
                    "label": "__MSG__PROFILE_BASIC_PREFERREDNAME_LABEL__",
                    "required": false,
                    "display": true
                },
                "status": {
                    "label": "__MSG__PROFILE_BASIC_STATUS_LABEL__",
                    "required": false,
                    "display": false
                }
            }
        },
        "email" :{
            "label": "Email Address",
            "required": true,
            "display": true,
            "access": "everybody",
            "modifyacl": false,
            "order": 1,
            "permission": "private",
            "elements": {
                "email": {
                    "label": "Email",
                    "required": true,
                    "display": true,
                    "limitDisplayLength": 50,
                    "editable": false
                }
            }
        },
        "institutional" : {
            "label": "Institutional Information",
            "required": true,
            "display": true,
            "access": "everybody",
            "modifyacl": false,
            "order": 2,
            "permission": "everyone",
            "elements": {
                "role": {
                    "label": "Role/position",
                    "required": true,
                    "display": true,
                    "limitDisplayLength": 50,
                    "editable": false
                },
                "college": {
                    "label": "College",
                    "required": true,
                    "display": true,
                    "limitDisplayLength": 50,
                    "editable": false
                },
                "major": {
                    "label": "Major",
                    "required": true,
                    "display": true,
                    "limitDisplayLength": 50,
                    "editable": false
                }
            }
        },
        "aboutme": {
            "label": "__MSG__PROFILE_ABOUTME_LABEL__",
            "required": true,
            "display": true,
            "access": "everybody",
            "modifyacl": true,
            "order": 3,
            "permission": "everyone",
            "elements": {
                "aboutme": {
                    "label": "__MSG__PROFILE_ABOUTME_LABEL__",
                    "required": false,
                    "display": true,
                    "type": "textarea"
                },
                "academicinterests": {
                    "label": "__MSG__PROFILE_ABOUTME_ACADEMICINTERESTS_LABEL__",
                    "required": false,
                    "display": true,
                    "type": "textarea"
                },
                "personalinterests": {
                    "label": "__MSG__PROFILE_ABOUTME_PERSONALINTERESTS_LABEL__",
                    "required": false,
                    "display": true,
                    "type": "textarea"
                },
                "hobbies": {
                    "label": "__MSG__PROFILE_ABOUTME_HOBBIES_LABEL__",
                    "required": false,
                    "display": true
                },
                "tags": {
                    "label": "__MSG__TAGS_AND_CATEGORIES__",
                    "required": false,
                    "display": true,
                    "type": "tags",
                    "tagField": true
                }
            }
        },
        "publications": {
            "label": "__MSG__PROFILE_PUBLICATIONS_LABEL__",
            "required": false,
            "display": true,
            "access": "everybody",
            "modifyacl": true,
            "multiple": true,
            "multipleLabel": "__MSG__PROFILE_PUBLICATION_LABEL__",
            "order": 5,
            "permission": "everyone",
            //"template": "profile_section_publications_template",
            "elements": {
                "maintitle": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_MAIN_TITLE__",
                    "required": true,
                    "editable": true,
                    "display": true,
                    "example": "__MSG__PROFILE_PUBLICATIONS_MAIN_TITLE_EXAMPLE__"
                },
                "mainauthor": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_MAIN_AUTHOR__",
                    "required": true,
                    "editable": true,
                    "display": true
                },
                "coauthor": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_CO_AUTHOR__",
                    "required": false,
                    "editable": true,
                    "display": true,
                    "example": "__MSG__PROFILE_PUBLICATIONS_CO_AUTHOR_EXAMPLE__"
                },
                "publisher": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_PUBLISHER__",
                    "required": true,
                    "editable": true,
                    "display": true
                },
                "placeofpublication": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_PLACE_OF_PUBLICATION__",
                    "required": true,
                    "editable": true,
                    "display": true
                },
                "volumetitle": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_VOLUME_TITLE__",
                    "required": false,
                    "editable": true,
                    "display": true
                },
                "volumeinformation": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_VOLUME_INFORMATION__",
                    "required": false,
                    "editable": true,
                    "display": true,
                    "example": "__MSG__PROFILE_PUBLICATIONS_VOLUME_INFORMATION_EXAMPLE__"
                },
                "year": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_YEAR__",
                    "required": true,
                    "editable": true,
                    "display": true
                },
                "number": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_NUMBER__",
                    "required": false,
                    "editable": true,
                    "display": true
                },
                "series title": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_SERIES_TITLE__",
                    "required": false,
                    "editable": true,
                    "display": true
                },
                "url": {
                    "label": "__MSG__PROFILE_PUBLICATIONS_URL__",
                    "required": false,
                    "editable": true,
                    "display": true,
                    "validation": "appendhttp url"
                }
            }
        }
    };

    // Custom CSS Files to load in
    // config.skinCSS = ["/dev/skins/default/skin.css"];
    config.skinCSS = ["/dev/skins/myb/skin.css"];


    // CalCentral custom Relationships
    config.Relationships = {
        /*
         * Relationships used by the add contacts widget to define what relationship the contacts can have
         */
        "contacts": [{
            "name": "Shares Interests",
            "definition": "shares an interest with me",
            "selected": true
        }, {
            "name": "Friend",
            "definition": "is my friend",
            "selected": false
        }, {
            "name": "Contact",
            "definition": "is my contact",
            "selected": false
        }, {
            "name": "Classmate",
            "definition": "is my classmate",
            "selected": false
        }, {
            "name": "Professor",
            "inverse": "Student",
            "definition": "is my professor",
            "selected": false
        }, {
            "name": "Student",
            "inverse": "Professor",
            "definition": "is my student",
            "selected": false
        }, {
            "name": "Colleague",
            "definition": "is my colleague",
            "selected": false
        }]
    };

    /*
    * CalCentral Hybrid 0.5
    * the props commented out below are set in env.{env}.js
    * per environment e.g. myberkeley/configs/dev/load/env.dev.js
    * they cannot appear here as they must be
    * unique to the env.{env}.js file or their
    * values will be overriden by assignment here
    * config.showSakai2=false;
    * config.useLiveSakai2Feeds=false;
    */

    // adds the Sakai 2 Sites item to the left hand nav
    config.defaultprivstructure['${refid}0']['${refid}5'].dashboard.columns.column1.push({
        'uid': '${refid}1234',
        'visible': 'block',
        'name': 'mysakai2'
    });

    config.defaultprivstructure.structure0['sakai2sites'] =  {
        '_ref': '${refid}2345',
        '_title': 'My bSpace sites',
        '_order': 2,
        '_canEdit': true,
        '_reorderOnly': true,
        '_nonEditable': true,
        'main': {
            '_ref': '${refid}2345',
            '_order': 0,
            '_title': 'My Sakai 2 sites'
        }
    };

    config.defaultprivstructure['${refid}2345'] = {
        'rows': [
            {
                'id': 'id8965114',
                'columns': [
                    {
                        'width': 1,
                        'elements': [
                            {
                                'id': '${refid}2346',
                                'type': 'searchsakai2'
                            }
                        ]
                    }
                ]
            }
        ]
    };

    // adds the My Sakai 2 Sites menu item to the Me menu
    config.Navigation[0].subnav.splice(2,0, {
        'url': '/me#l=sakai2sites',
        'id': 'subnavigation_sakai2_link',
        'label': 'MY_SAKAI2_SITES'
    });

    // End CalCentral custom

    /**
     * Kaltura Settings
     */
    config.kaltura = {
        enabled: false, // Enable/disable Kaltura player
        serverURL:  "http://www.kaltura.com", //INSERT_KALTURA_INSTALLATION_URL_HERE
        partnerId:  100, //INSERT_YOUR_PARTNER_ID_HERE
        playerId: 100 //INSERT_YOUR_PLAYER_ID_HERE
    };

    return config;
});
