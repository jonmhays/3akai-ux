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
        "_order": 2,
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
            "_order": 3,
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
        college_of_letters_science_arts_humanities: {
            title_prefix: "College of Letters & Science",
            title: "Arts & Humanities",
            children: {
                science_arts_humanities_ancient_history_mediterranean_archaeology: {
                    title: "Ancient History & Mediterranean Archaeology"
                },
                science_arts_humanities_art_history: {
                    title: "Art History"
                },
                science_arts_humanities_art_practice: {
                    title: "Art Practice"
                },
                science_arts_humanities_arts_research_center: {
                    title: "Arts Research Center"
                },
                science_arts_humanities_berkeley_language_center: {
                    title: "Berkeley Language Center"
                },
                science_arts_humanities_berkeley_war_crimes_studies_center: {
                    title: "Berkeley War Crimes Studies Center"
                },
                science_arts_humanities_buddhist_studies: {
                    title: "Buddhist Studies"
                },
                science_arts_humanities_celtic_studies: {
                    title: "Celtic Studies"
                },
                science_arts_humanities_center_for_new_music_audio_technologies: {
                    title: "Center for New Music & Audio Technologies"
                },
                science_arts_humanities_classics: {
                    title: "Classics"
                },
                science_arts_humanities_comparative_literature: {
                    title: "Comparative Literature"
                },
                science_arts_humanities_dutch_studies: {
                    title: "Dutch Studies"
                },
                science_arts_humanities_east_asian_languages_cultures: {
                    title: "East Asian Languages & Cultures"
                },
                science_arts_humanities_english: {
                    title: "English"
                },
                science_arts_humanities_film_media: {
                    title: "Film & Media"
                },
                science_arts_humanities_french: {
                    title: "French"
                },
                science_arts_humanities_german: {
                    title: "German"
                },
                science_arts_humanities_italian_studies: {
                    title: "Italian Studies"
                },
                science_arts_humanities_jewish_studies: {
                    title: "Jewish Studies"
                },
                science_arts_humanities_medieval_studies: {
                    title: "Medieval Studies"
                },
                science_arts_humanities_music: {
                    title: "Music"
                },
                science_arts_humanities_near_eastern_studies: {
                    title: "Near Eastern Studies"
                },
                science_arts_humanities_philosophy: {
                    title: "Philosophy"
                },
                science_arts_humanities_rhetoric: {
                    title: "Rhetoric"
                },
                science_arts_humanities_romance_languages_literature: {
                    title: "Romance Languages & Literature"
                },
                science_arts_humanities_scandinavian: {
                    title: "Scandinavian"
                },
                science_arts_humanities_slavic_languages_and_literature: {
                    title: "Slavic Languages and Literature"
                },
                science_arts_humanities_south_southeast_asian_studies: {
                    title: "South & Southeast Asian Studies"
                },
                science_arts_humanities_spanish_portugese: {
                    title: "Spanish & Portugese"
                },
                science_arts_humanities_theater_dance_performance_studies: {
                    title: "Theater, Dance & Performance Studies"
                },
                science_arts_humanities_townsend_center_for_the_humanities: {
                    title: "Townsend Center for the Humanities"
                }
            }

        },
        college_of_letters_science_biological_sciences: {
            title_prefix: "College of Letters & Science",
            title: "Biological Sciences",
            children: {
                science_biological_sciences_biochemistry_biophysics_structural_biology: {
                    title: "Biochemistry, Biophysics & Structural Biology"
                },
                science_biological_sciences_cell_developmental_biology: {
                    title: "Cell & Developmental Biology"
                },
                science_biological_sciences_genetics_geonomics_development: {
                    title: "Genetics, Geonomics & Development"
                },
                science_biological_sciences_immunology_pathogenesis: {
                    title: "Immunology & Pathogenesis"
                },
                science_biological_sciences_integrative_biology: {
                    title: "Integrative Biology"
                },
                science_biological_sciences_molecular_and_cell_biology: {
                    title: "Molecular and Cell Biology"
                },
                science_biological_sciences_neurobiology: {
                    title: "Neurobiology"
                },
                science_biological_sciences_physical_education: {
                    title: "Physical Education"
                }
            }
        },
        haas_school_of_business: {
            title_prefix: "Haas School of",
            title: "Business",
            children: {
                haas_accounting: {
                    title: "Accounting"
                },
                haas_business_public_policy: {
                    title: "Business & Public Policy"
                },
                haas_economic_analysis_policy: {
                    title: "Economic Analysis & Policy"
                },
                haas_finance: {
                    title: "Finance"
                },
                haas_management_of_organizations: {
                    title: "Management of Organizations"
                },
                haas_marketing: {
                    title: "Marketing"
                },
                haas_operations_information_technology_management: {
                    title: "Operations & Information Technology Management"
                },
                haas_real_estate: {
                    title: "Real Estate"
                }
            }
        },
        college_of_chemistry: {
            title_prefix: "College of",
            title: "Chemistry",
            children: {
                college_of_chemistry_chemical_biomolecular_engineering: {
                    title: "Chemical & Biomolecular Engineering"
                },
                college_of_chemistry_chemistry: {
                    title: "Chemistry"
                },
                college_of_chemistry_materials_science_engineering: {
                    title: "Materials Science & Engineering"
                },
                college_of_chemistry_nuclear_engineering: {
                    title: "Nuclear Engineering"
                }
            }
        },
        graduate_school_of_education: {
            title_prefix: "Graduate School of",
            title: "Education",
            children: {
                graduate_school_of_education_education: {
                    title: "Education"
                },
                graduate_school_of_education_science_mathematics_education: {
                    title: "Science & Mathematics Education"
                }
            }
        },
        college_of_engineering: {
            title_prefix: "College of",
            title: "Engineering",
            children: {
                college_of_engineering_applied_science_technology: {
                    title: "Applied Science & Technology"
                },
                college_of_engineering_bioengineering: {
                    title: "Bioengineering"
                },
                college_of_engineering_civil_environmental_engineering: {
                    title: "Civil & Environmental Engineering"
                },
                college_of_engineering_computational_genomic_biology: {
                    title: "Computational & Genomic Biology "
                },
                college_of_engineering_computer_science: {
                    title: "Computer Science"
                },
                college_of_engineering_electrical_engineering: {
                    title: "Electrical Engineering"
                },
                college_of_engineering_engineering: {
                    title: "Engineering"
                },
                college_of_engineering_industrial_engineering_operations_research: {
                    title: "Industrial Engineering & Operations Research"
                },
                college_of_engineering_materials_science_engineering: {
                    title: "Materials Science & Engineering "
                },
                college_of_engineering_mechanical_engineering: {
                    title: "Mechanical Engineering"
                },
                college_of_engineering_nanoscale_science_engineering: {
                    title: "Nanoscale Science & Engineering"
                },
                college_of_engineering_ocean_engineering: {
                    title: "Ocean Engineering"
                }
            }
        },
        college_of_environmental_design: {
            title_prefix: "College of",
            title: "Environmental Design",
            children: {
                ced_architecture: {
                    title: "Architecture"
                },
                ced_city_regional_planning: {
                    title: "City & Regional Planning"
                },
                ced_environmental_design: {
                    title: "Environmental Design"
                },
                ced_landscape_architecture: {
                    title: "Landscape Architecture"
                },
                ced_visual_studies: {
                    title: "Visual Studies"
                }
            }
        },
        school_of_information: {
            title_prefix: "School of",
            title: "Information",
            children: {
                school_of_information_human_computer_interaction: {
                    title: "Human-Computer Interaction"
                },
                school_of_information_information_communication_technologies_development: {
                    title: "Information & Communication Technologies & Development"
                },
                school_of_information_information_economics_policy: {
                    title: "Information Economics & Policy"
                },
                school_of_information_information_law_policy: {
                    title: "Information Law & Policy"
                },
                school_of_information_information_organization_retrieval: {
                    title: "Information Organization & Retrieval"
                },
                school_of_information_information_systems_design: {
                    title: "Information Systems Design"
                },
                school_of_information_social_aspects_of_information: {
                    title: "Social Aspects of Information"
                }
            }
        },
        interdepartmental_graduate_programs: {
            title: "Interdepartmental Graduate Programs",
            children: {
                interdepartmental_graduate_programs_comparative_biochemistry: {
                    title: "Comparative Biochemistry"
                },
                interdepartmental_graduate_programs_energy_resources_group: {
                    title: "Energy & Resources Group"
                }
            }
        },
        graduate_school_of_journalism: {
            title_prefix: "Graduate School of",
            title: "Journalism",
            children: {
                jschool_business_reporting: {
                    title: "Business Reporting"
                },
                jschool_documentary: {
                    title: "Documentary"
                },
                jschool_environmental_science_journalism: {
                    title: "Environmental & Science Journalism"
                },
                jschool_international_reporting: {
                    title: "International Reporting"
                },
                jschool_investigative_reporting: {
                    title: "Investigative Reporting"
                },
                jschool_magazine: {
                    title: "Magazine"
                },
                jschool_new_media: {
                    title: "New Media"
                },
                jschool_newspaper: {
                    title: "Newspaper"
                },
                jschool_photojournalism: {
                    title: "Photojournalism"
                },
                jschool_political_reporting: {
                    title: "Political Reporting"
                },
                jschool_radio: {
                    title: "Radio"
                },
                jschool_television: {
                    title: "Television"
                }
            }
        },
        school_of_law: {
            title_prefix: "School of",
            title: "Law",
            children: {
                school_of_law_business_law_economics: {
                    title: "Business, Law & Economics"
                },
                school_of_law_comparative_legal_studies: {
                    title: "Comparative Legal Studies"
                },
                school_of_law_environmental_law: {
                    title: "Environmental Law"
                },
                school_of_law_international_legal_studies: {
                    title: "International Legal Studies"
                },
                school_of_law_law: {
                    title: "Law"
                },
                school_of_law_law_technology: {
                    title: "Law & Technology"
                },
                school_of_law_legal_studies: {
                    title: "Legal Studies"
                },
                school_of_law_social_justice: {
                    title: "Social Justice"
                }
            }
        },
        college_of_letters_science_mathematical_physical_sciences: {
            title_prefix: "College of Letters & Science",
            title: "Mathematical & Physical Sciences",
            children: {
                mathematical_physical_sciences_astronomy: {
                    title: "Astronomy"
                },
                mathematical_physical_sciences_earth_planetary_science: {
                    title: "Earth & Planetary Science"
                },
                mathematical_physical_sciences_physics: {
                    title: "Physics"
                },
                mathematical_physical_sciences_statistics: {
                    title: "Statistics"
                }
            }
        },
        college_of_natural_resources: {
            title_prefix: "College of",
            title: "Natural Resources",
            children: {
                cnr_agricultural_resource_economics: {
                    title: "Agricultural & Resource Economics"
                },
                cnr_environmental_science_policy_management: {
                    title: "Environmental Science Policy & Management"
                },
                cnr_environmental_economics_policy: {
                    title: "Environmental Economics & Policy"
                },
                cnr_natural_resources: {
                    title: "Natural Resources"
                },
                cnr_nutritional_sciences_toxicology: {
                    title: "Nutritional Sciences & Toxicology"
                },
                cnr_plant_microbial_biology: {
                    title: "Plant & Microbial Biology"
                }
            }
        },
        school_of_optometry: {
            title_prefix: "School of",
            title: "Optometry",
            children: {
                school_of_optometry_optometry: {
                    title: "Optometry"
                },
                school_of_optometry_vision_science: {
                    title: "Vision Science"
                }
            }
        },
        school_of_public_health: {
            title_prefix: "School of",
            title: "Public Health",
            children: {
                school_of_public_health_biostatistics: {
                    title: "Biostatistics"
                },
                school_of_public_health_environmental_health_sciences: {
                    title: "Environmental Health Sciences"
                },
                school_of_public_health_epidemiology: {
                    title: "Epidemiology"
                },
                school_of_public_health_health_medical_services: {
                    title: "Health & Medical Services"
                },
                school_of_public_health_health_social_behavior: {
                    title: "Health & Social Behavior"
                },
                school_of_public_health_health_policy_management: {
                    title: "Health Policy & Management"
                },
                school_of_public_health_health_services_policy_analysis: {
                    title: "Health Services & Policy Analysis"
                },
                school_of_public_health_infectious_disease_vaccinology: {
                    title: "Infectious Disease & Vaccinology"
                },
                school_of_public_health_maternal_child_health: {
                    title: "Maternal & Child Health"
                },
                school_of_public_health_public_health: {
                    title: "Public Health"
                },
                school_of_public_health_public_health_nutrition: {
                    title: "Public Health Nutrition"
                }
            }
        },
        goldman_school_of_public_policy: {
            title_prefix: "Goldman School of",
            title: "Public Policy",
            children: {
                public_policy_public_policy: {
                    title: "Public Policy"
                }
            }
        },
        college_of_letters_science_social_sciences: {
            title_prefix: "College of Letters & Science",
            title: "Social Sciences",
            children: {
                science_social_sciences_african_american_studies: {
                    title: "African American Studies"
                },
                science_social_sciences_anthropology: {
                    title: "Anthropology"
                },
                science_social_sciences_demography: {
                    title: "Demography"
                },
                science_social_sciences_economics: {
                    title: "Economics"
                },
                science_social_sciences_ethnic_studies: {
                    title: "Ethnic Studies"
                },
                science_social_sciences_gender_and_womens_studies: {
                    title: "Gender and Women's Studies"
                },
                science_social_sciences_geography: {
                    title: "Geography"
                },
                science_social_sciences_history: {
                    title: "History"
                },
                science_social_sciences_linguistics: {
                    title: "Linguistics"
                },
                science_social_sciences_political_science: {
                    title: "Political Science"
                },
                science_social_sciences_psychology: {
                    title: "Psychology"
                },
                science_social_sciences_sociology: {
                    title: "Sociology"
                }
            }
        },
        school_of_social_welfare: {
            title_prefix: "School of",
            title: "Social Welfare",
            children: {
                school_of_social_welfare_social_welfare: {
                    title: "Social Welfare"
                }
            }
        },
        undergraduate_interdisciplinary_studies: {
            title: "Undergraduate & Interdisciplinary Studies",
            children: {
                undergraduate_interdisciplinary_studies_american_studies: {
                    title: "American Studies"
                },
                undergraduate_interdisciplinary_studies_asian_studies: {
                    title: "Asian Studies"
                },
                undergraduate_interdisciplinary_studies_cognitive_science: {
                    title: "Cognitive Science"
                },
                undergraduate_interdisciplinary_studies_creative_writing: {
                    title: "Creative Writing"
                },
                undergraduate_interdisciplinary_studies_college_writing_program: {
                    title: "College Writing Program"
                },
                undergraduate_interdisciplinary_studies_development_studies: {
                    title: "Development Studies"
                },
                undergraduate_interdisciplinary_studies_disability_studies: {
                    title: "Disability Studies"
                },
                undergraduate_interdisciplinary_studies_environmental_sciences: {
                    title: "Environmental Sciences"
                },
                undergraduate_interdisciplinary_studies_interdisciplinary_studies: {
                    title: "Interdisciplinary Studies"
                },
                undergraduate_interdisciplinary_studies_latin_american_studies: {
                    title: "Latin American Studies"
                },
                undergraduate_interdisciplinary_studies_media_studies: {
                    title: "Media Studies"
                },
                undergraduate_interdisciplinary_studies_middle_eastern_studies: {
                    title: "Middle Eastern Studies"
                },
                undergraduate_interdisciplinary_studies_military_affairs: {
                    title: "Military Affairs"
                },
                undergraduate_interdisciplinary_studies_peace_conflict_studies: {
                    title: "Peace & Conflict Studies"
                },
                undergraduate_interdisciplinary_studies_political_economy_of_industrial_societies: {
                    title: "Political Economy of Industrial Societies"
                },
                undergraduate_interdisciplinary_studies_religious_studies: {
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
        campus_academic: {
            title: "Academic",
            children: {}
        },
        campus_arts: {
            title: "Arts",
            children: {}
        },
        campus_culture: {
            title: "Culture",
            children: {}
        },
        campus_political: {
            title: "Political",
            children: {}
        },
        campus_professional: {
            title: "Professional",
            children: {}
        },
        campus_sport: {
            title: "Sport",
            children: {}
        },
        campus_religious: {
            title: "Religious",
            children: {}
        },
        campus_service: {
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
