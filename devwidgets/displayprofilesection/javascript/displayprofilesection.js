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
/*
 * Dependencies
 *
 * /dev/lib/jquery/plugins/jqmodal.sakai-edited.js
 * /dev/lib/misc/trimpath.template.js (TrimpathTemplates)
 */
require(["jquery", "sakai/sakai.api.core", "underscore"], function($, sakai, _) {

    /**
     * @name sakai_global.displayprofilesection
     *
     * @class displayprofilesection
     *
     * @description
     * Initialize the displayprofilesection widget
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.displayprofilesection = function( tuid, showSettings, widgetData ) {
        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        var editing = false;
        var userid = false;
        var multiple = false;
        var multipleSectionLength = 0;
        var sectionData = false;
        var allowUpdate = true;
        var isMe = false;

        ///////////////////
        // CSS Selectors //
        ///////////////////

        var $rootel = $( "#" + tuid ),
            $displayprofilesection_container = $( "#displayprofilesection_container", $rootel ),
            $displayprofilesection_header = $( "#displayprofilesection_header", $rootel ),
            $displayprofilesection_header_template = $( "#displayprofilesection_header_template", $rootel ),
            $displayprofilesection_body = $( "#displayprofilesection_body", $rootel ),
            $displayprofilesection_body_template = $( "#displayprofilesection_body_template", $rootel ),
            $displayprofilesection_view_template = $( "#displayprofilesection_view_template", $rootel ),
            $displayprofilesection_edit_template = $( "#displayprofilesection_edit_template", $rootel ),
            $displayprofilesection_edit_multiple_template = $( "#displayprofilesection_edit_multiple_template", $rootel ),
            $displayprofilesection_view_multiple_template = $( "#displayprofilesection_view_multiple_template" , $rootel ),
            $displayprofilesection_view_no_results_template = $( "#displayprofilesection_view_no_results_template", $rootel ),
            $profile_message_form_successful = $( "#profile_message_form_successful", $rootel ),
            $profile_error_form_error_server = $( "#profile_error_form_error_server", $rootel ),
            $displayprofilesection_sections_multiple = false,
            $displayprofilesection_add_button = false,
            $form = false;

        // Transform the form values from a multiple-assign section into a different data structure
        var getMultipleValues = function( values ) {
            var uniqueContainers = $( "div.displayprofilesection_multiple_section" );
            var multipleValues = {};
            $.each( uniqueContainers, function( i, elt ) {
                multipleValues[ $( elt ).attr( "id" ).replace( "form_group_", "" ) ] = {
                    order: i
                };
            });
            $.each( values, function( i, val ) {
                // Each ID is of format fieldtitle_formuniqueid
                var field = i.substring( 0, i.lastIndexOf( "_" ));
                var mvKey = i.substring( i.lastIndexOf( "_" ) + 1 );
                multipleValues[ mvKey ][ field ] = val;
            });
            values = multipleValues;
            return values;
        };

        var handleSave = function( success, data ) {
            if (success) {
                sakai.api.Util.notification.show("", $profile_message_form_successful.text() , sakai.api.Util.notification.type.INFORMATION);
                editing = false;
                getData(renderSection);
            } else {
                sakai.api.Util.notification.show("", $profile_error_form_error_server.text() , sakai.api.Util.notification.type.ERROR);
                debug.error("The profile data couldn't be saved successfully");
            }
        };

        /**
         * Event handler callback to switching the profile view to edit mode.
         * @param {object} event object for the event handler. expected to hold data.editingMode.
         */
        var toggleEdit = function(event) {
            editing = (event && event.data && event.data.editingMode === true) || false;
            getData(renderSection);
            //CalCentral modifications START
            if (editing) {
                $rootel.trigger('auto-append-new.myb');
            }
            //CalCentral modifications END
        }

        /**
         * Enables the 'Update Profile' button when the user has changed their profile information.
         */
        var enableUpdate = function() {
            if (allowUpdate) {
                $('button.profile-section-save-button', $rootel).removeAttr('disabled');
            }
        };

        var saveValues = function() {
            // Serialize the data from the form for saving
            var values = $form.serializeObject();
            if ( multiple ) {
                values = getMultipleValues( values );
            }

            // Get tags & categories if they're in this form
            var tags = [];
            var $tagfield = $displayprofilesection_body.find( "textarea[data-tag-field]" );
            if ( $tagfield.length ) {
                // Remove the hidden autosuggest input field from the values
                $form.find( "input" ).each( function( i, input ) {
                    if ( $( input ).hasClass( "as-values" ) ) {
                        delete values[ $( input ).attr("name") ];
                    }
                });
                tags = sakai.api.Util.AutoSuggest.getTagsAndCategories( $tagfield, true );
            }

            //sakai.api.User.updateUserProfile(userid, widgetData.sectionid, values, tags, sectionData, multiple, handleSave);
            /** CalCentral specific changes for view permissions BEGIN **/
            if (widgetData.sectionid === 'aboutme') {
                if (sectionData && sectionData["sakai:tags"]) {
                    sectionData["sakai:tags"].value = sectionData["sakai:tags"].value.split(',');
                }
            }
            sakai.api.User.updateUserProfile(userid, widgetData.sectionid, values, tags, sectionData, multiple, function(success, data) {
                if (widgetData.sectionid === 'basic') {
                    savePanelPermissions(success, data);
                } else{
                    //sanity check
                    var tmpSectionId = widgetData.sectionid;
                    var section_permission_exists = $('#displayprofilesection_form_' + tmpSectionId + ' select.user_permissions').val() || false;
                    if (section_permission_exists) {
                        sakai_global.user.pubdata.structure0.profile[tmpSectionId]._view = section_permission_exists;
                        sakai.api.Server.saveJSON("/~" + sakai.data.me.user.userid + "/public/pubspace", {
                             "structure0": JSON.stringify(sakai_global.user.pubdata.structure0)
                        });
                        sakai.api.Content.setACLsOnPath("/~" + sakai.data.me.user.userid + "/public/authprofile/" + tmpSectionId, section_permission_exists, sakai.data.me.user.userid, function() {
                            handleSave(success, data);
                        });
                    }
                }
            });
            /** CalCentral specific changes for view permissions END **/

            $('button.profile-section-save-button', $rootel).attr('disabled', 'disabled');
            return false;
        };

        // Remove a section from the a multi-assign section
        var removeSection = function( unique ) {
            $( "div#form_group_" + unique ).remove();
            sakai.api.User.deleteUserProfileSection( userid, widgetData.sectionid, unique, handleSave);
            if ( $( "div.displayprofilesection_multiple_section" ).length === 0 ) {
                $( "button.profile-section-save-button", $rootel ).hide();
            }
        };

        // Add a new section to a multi-assign section
        var addEmptySection = function( section, template ) {
            var unique = "" + Math.round( Math.random() * 1000000000 );
            multipleSectionLength++;
            var sectionHTML = sakai.api.Util.TemplateRenderer( template, {
                sectionid: widgetData.sectionid,
                section: section,
                unique: unique,
                order: multipleSectionLength,
                data: {}
            });
            $displayprofilesection_sections_multiple.append( sakai.api.i18n.General.process( sectionHTML ) );
            $('button.profile-section-save-button, button.profile-section-cancel-button', $rootel ).show();
            $( "button#displayprofilesection_remove_link_" + unique, $rootel ).bind( "click", function() {
                removeSection( unique );
            });
        };

        var sectionHasElements = function( section ) {
            var hasElts = false;
            if ( section ) {
                $.each( section, function( i, elt ) {
                    if ( $.isPlainObject( elt ) ) {
                        hasElts = true;
                    }
                });
            }
            return hasElts;
        };

        var renderEmptySection = function( userProfile, section ) {
            var messageKey = "THIS_PERSON_HASNT_ADDED_INFORMATION";
            var sectionKey = "THIS_PERSON_HASNT_ADDED_" + widgetData.sectionid.toUpperCase();
            // Changing the message for "me"
            if (isMe) {
                messageKey = 'YOU_HAVE_NO_INFORMATION';
                sectionKey = 'YOU_HAVE_NO_' + widgetData.sectionid.toUpperCase();
            }
            if ( sakai.api.i18n.getValueForKey( sectionKey, "displayprofilesection") !== sectionKey ) {
                messageKey = sectionKey;
            }
            var emptyHTML = sakai.api.Util.TemplateRenderer( $displayprofilesection_view_no_results_template, {
                userid: userid,
                displayName: sakai.api.User.getDisplayName( userProfile ),
                errorString: sakai.api.i18n.getValueForKey( messageKey, "displayprofilesection" ),
                showMessage: !sakai.api.User.isAnonymous(sakai.data.me),
                sectionid: widgetData.sectionid,
                isMe: isMe
            });
            $displayprofilesection_body.html( sakai.api.i18n.General.process( emptyHTML ) );
        };

        // Render a multi-assign section
        var renderMultiSection = function ( template, section, data ) {
            multiple = true;
            var multiTemplate = editing ? $displayprofilesection_edit_multiple_template : $displayprofilesection_view_multiple_template;

            var multHTML = sakai.api.Util.TemplateRenderer( multiTemplate, {
                sectionid: widgetData.sectionid,
                section: section
            });
            $displayprofilesection_body.html( sakai.api.i18n.General.process( multHTML ) );

            // Grab the new container to render into
            $displayprofilesection_sections_multiple = $( "#displayprofilesection_sections_" + widgetData.sectionid );
            if ( editing ) {
                $displayprofilesection_add_button = $( "#displayprofilesection_add_" + widgetData.sectionid );
                $displayprofilesection_add_button.bind("click", function() {
                    addEmptySection( section, template );
                });
            }

            // If there is some data, render each section
            if (data[widgetData.sectionid] && data[widgetData.sectionid].elements) {
                var subSections = [];
                // Convert the sectionData into an array so we can order it
                $.each( data[ widgetData.sectionid ].elements, function( uid, sectionData ) {
                    if ( $.isPlainObject( sectionData ) ) {
                        var obj = {};
                        obj[ uid ] = sectionData;
                        subSections.push( obj );
                    }
                });
                // Sort the sections by order
                subSections = subSections.sort( function ( a, b ) {
                    return _.values( a )[ 0 ].order - _.values( b )[ 0 ].order;
                });
                $.each( subSections, function( i, sectionData ) {
                    if ( $.isPlainObject( sectionData ) ) {
                        // Just keep incrementing, since we're not supporting re-ordering yet
                        multipleSectionLength = _.values( sectionData )[ 0 ].order > multipleSectionLength ? _.values( sectionData )[ 0 ].order : multipleSectionLength;
                        var uid = _.keys( sectionData )[ 0 ];
                        var sectionHTML = sakai.api.Util.TemplateRenderer( template, {
                            section: section,
                            sectionid: widgetData.sectionid,
                            sakai: sakai,
                            unique: uid,
                            data: _.values( sectionData )[ 0 ],
                            order: _.values( sectionData )[ 0 ].order
                        });
                        $displayprofilesection_sections_multiple.append( sakai.api.i18n.General.process( sectionHTML ) );
                        if ( editing ) {
                            $( "button#displayprofilesection_remove_link_" + uid, $rootel ).bind( "click", function() {
                                removeSection( uid );
                            });
                        }
                    }
                });
                if ( editing && subSections.length ) {
                    $( "button.profile-section-save-button", $rootel ).show();
                } else if ( !editing && !subSections.length ) {
                    renderEmptySection( data );
                    // CalCentral modifications to bind empty content sections to automatically add a new section START
                    if (widgetData.sectionid === 'publications') {
                        $rootel.on('auto-append-new.myb', function() {
                            $('button#displayprofilesection_add_publications', $displayprofilesection_body).trigger('click');
                        });
                    }
                    // CalCentral modifications to bind empty content sections to automatically add a new section END
                } else if ( !editing ){
                    $( ".displayprofilesection_multiple_sections hr:last" ).hide();
                }
            } else if ( !editing ) {
                renderEmptySection( data );
                // CalCentral modifications to bind empty content sections to automatically add a new section START
                if (widgetData.sectionid === 'publications') {
                    $rootel.on('auto-append-new.myb', function() {
                        $('button#displayprofilesection_add_publications', $displayprofilesection_body).trigger('click');
                    });
                }
                // CalCentral modifications to bind empty content sections to automatically add a new section END
            }
        };

        var renderSection = function( success, data ) {
            if ( success ) {
                var section = sakai.config.Profile.configuration.defaultConfig[ widgetData.sectionid ];

                if ( section ) {
                    var template = $displayprofilesection_view_template;
                    if ( editing ) {
                        template = $displayprofilesection_edit_template;
                    }

                    // Render header
                    var pageTitle = section.label;
                    if (!editing && section.altLabel) {
                        pageTitle = sakai.api.i18n.General.process(section.altLabel)
                            .replace('${user}', sakai.api.User.getFirstName(sakai_global.profile.main.data));
                    }

                    var headerHTML = sakai.api.Util.TemplateRenderer( $displayprofilesection_header_template, {
                        pageTitle: pageTitle,
                        isMe: isMe,
                        sectionid: widgetData.sectionid
                    });
                    $displayprofilesection_header.html( sakai.api.i18n.General.process( headerHTML ) );

                    // If it is a multiple section, we have to render it with some love
                    if ( section.multiple ) {
                        renderMultiSection( template, section, data );
                    } else {
                        // data[widgetData.sectionid] won't exist when the user hasn't logged in before
                        if (editing || (data[widgetData.sectionid] && sectionHasElements(data[widgetData.sectionid].elements))) {
                            sectionData = data[ widgetData.sectionid ] && data[ widgetData.sectionid ].elements ? data[ widgetData.sectionid ].elements : false;
                            //sanity check, if all values are empty, should probably render no data section message instead.
                            var noData = true;
                            $.each(sectionData, function(elt, sectionObject) {
                                if (sectionObject && sectionObject.value && sectionObject.value !== '') {
                                    noData = false;
                                    return false;
                                }
                            });
                            //additional checking for the about me section for the tags
                            if (noData && !editing && widgetData.sectionid === 'aboutme') {
                                if (data["sakai:tags"] && data["sakai:tags"].length) {
                                    noData = false;
                                }
                            }
                            if (noData && !editing) {
                                renderEmptySection(data, section);
                            } else {
                                /** CalCentral specific extension of aboutMe with tags data BEGIN **/
                                if (sectionData && widgetData.sectionid === 'aboutme' && !editing && data["sakai:tags"] && data["sakai:tags"].length) {
                                    sectionData["sakai:tags"] = {
                                        "value": data["sakai:tags"].toString()
                                    };
                                }
                                /** CalCentral specific extension of aboutMe with tags data END **/
                                $.each(section.elements, function(index, element) {
                                    if (element.altLabel) {
                                        element.altLabel = sakai.api.i18n.General.process(section.altLabel)
                                            .replace('${user}', sakai.api.User.getFirstName(sakai_global.profile.main.data));
                                    }
                                });
                                var bodyHTML = sakai.api.Util.TemplateRenderer( template, {
                                    sectionid: widgetData.sectionid,
                                    section: section,
                                    data: sectionData,
                                    unique: false,
                                    sakai: sakai
                                });
                                $displayprofilesection_body.html( sakai.api.i18n.General.process( bodyHTML ) );

                                /** CalCentral specific profile mucking BEGIN **/
                                if (widgetData.sectionid === 'basic') {
                                    var otherSections = ['email', 'institutional'];
                                    $(otherSections).each(function(elt, value) {
                                        var section = sakai.config.Profile.configuration.defaultConfig[value];
                                        var tmpData = data[value] && data[value].elements ? data[value].elements : false;
                                        var privacySetting = sakai_global.user.pubdata.structure0.profile[value]._view || '';
                                        if (tmpData !== false) {
                                            var divider = sakai.api.Util.TemplateRenderer($('#displayprofilesection_multiple_divider_template'), {
                                                title: section.label,
                                                sectionid: value,
                                                isMe: isMe,
                                                editing: editing,
                                                privacySetting: privacySetting
                                            });
                                            if (editing) {
                                                $('#displayprofilesection_form_basic', $rootel).append(divider);
                                            } else {
                                                $displayprofilesection_body.append(divider);
                                            }
                                        }
                                        var moreContent = sakai.api.Util.TemplateRenderer( $displayprofilesection_view_template, {
                                            sectionid: value,
                                            section: section,
                                            data: tmpData,
                                            unique: false,
                                            sakai: sakai
                                        });
                                        if (editing) {
                                            $('#displayprofilesection_form_basic', $rootel).append(moreContent);

                                        } else {
                                            $displayprofilesection_body.append(moreContent);
                                        }
                                    });

                                    // Shifting the submit buttons to a more logical location afterwards.
                                    var $tmpStore = $('#displayprofilesection_form_basic .dialog_buttons').remove().css('margin-right', '0px');
                                    $('#displayprofilesection_form_basic', $rootel).append($tmpStore);
                                }
                                /** CalCentral specific profile mucking END **/

                                var $tagfield = $displayprofilesection_body.find( "textarea[data-tag-field]" );
                                if ( $tagfield.length ) {
                                    allowUpdate = false;
                                    var autoSuggestOptions = {
                                        scrollHeight: 120,
                                        selectionAdded: function() {
                                            enableUpdate();
                                        },
                                        selectionRemoved: function(elem) {
                                            elem.remove();
                                            enableUpdate();
                                        }
                                    };
                                    var initialTagsValue = data["sakai:tags"] && data["sakai:tags"].length ? data["sakai:tags"] : false;
                                    sakai.api.Util.AutoSuggest.setupTagAndCategoryAutosuggest(
                                        $tagfield,
                                        autoSuggestOptions,
                                        $('.list_categories', $rootel),
                                        initialTagsValue,
                                        function() {
                                            allowUpdate = true;
                                        }
                                    );
                                }
                            }
                        } else {
                            renderEmptySection( data, section );
                        }
                    }

                    if (widgetData.sectionid !== 'basic') {
                        var value = widgetData.sectionid;
                        var tmpData = data[value] && data[value].elements ? data[value].elements : false;
                        var privacySetting = sakai_global.user.pubdata.structure0.profile[value]._view || '';
                        // if (tmpData !== false) {
                            var divider = sakai.api.Util.TemplateRenderer($('#displayprofilesection_multiple_divider_template'), {
                                title: "",
                                sectionid: value,
                                isMe: isMe,
                                editing: editing,
                                privacySetting: privacySetting
                            });

                        // }
                        if (editing) {
                            var $tmpform = $('#displayprofilesection_form_' + value, $rootel);
                            $tmpform.prepend(divider);
                            $('.mini_header', $tmpform).css('border-top', '0').css('padding-top', '0');
                        } else {
                            $displayprofilesection_body.prepend(divider);
                            $('.mini_header', $displayprofilesection_body).css('border-top', '0').css('padding-top', '0');
                        }

                    }

                    if ( editing ) {
                        $form = $( "#displayprofilesection_form_" + widgetData.sectionid, $rootel );
                        var validateOpts = {
                            submitHandler: saveValues,
                            messages: {}
                        };
                        // Set the custom error messages per field
                        $.each( section.elements, function( i, elt ) {
                            if ( elt.errorMessage ) {
                                validateOpts.messages[ i ] = {
                                    required: sakai.api.i18n.General.process( elt.errorMessage )
                                };
                            }
                        });
                        sakai.api.Util.Forms.validate( $form, validateOpts );
                        $('button.profile-section-cancel-button', $rootel).on('click', {'editingMode': false}, toggleEdit).show();
                        $('button.profile-section-edit-button', $rootel).hide();

                    } else if (!editing && isMe) {
                        $('button.profile-section-edit-button', $rootel).on('click', {'editingMode': true}, toggleEdit).show();
                    }

                    /* CalCentral specific code start */
                    toggleEditMode(editing);
                    /* CalCentral specific code end */
                }
            }
        };

        /** CalCentral specific code BEGIN **/

        var toggleEditMode = function (editing) {
            $displayprofilesection_body.toggleClass("profile_edit_mode", editing);
        };

        var savePanelPermissions = function(success, data) {
            //async saves makes this frustratingly silly... forcing email before institution
            // var permission = $('#displayprofilesection_form_basic select.user_permissions[data-sakai-profile-section="' + sectionid + '"]', $rootel).val() || false;
            // sakai.config.Profile.configuration.defaultConfig[sectionid].access = permission;

            var emailPermission = $('#displayprofilesection_form_basic select.user_permissions[data-sakai-profile-section="email"]', $rootel).val() || false;
            var institutionalPermission = $('#displayprofilesection_form_basic select.user_permissions[data-sakai-profile-section="institutional"]', $rootel).val() || false;

            if (emailPermission) {
                sakai_global.user.pubdata.structure0.profile.email._view = emailPermission;
                sakai.api.Content.setACLsOnPath("/~" + sakai.data.me.user.userid + "/public/authprofile/email", emailPermission, sakai.data.me.user.userid, function() {
                    if (institutionalPermission) {
                        sakai_global.user.pubdata.structure0.profile.institutional._view = institutionalPermission;

                        sakai.api.Server.saveJSON("/~" + sakai.data.me.user.userid + "/public/pubspace", {
                             "structure0": JSON.stringify(sakai_global.user.pubdata.structure0)
                        });
                        sakai.api.Content.setACLsOnPath("/~" + sakai.data.me.user.userid + "/public/authprofile/institutional", institutionalPermission, sakai.data.me.user.userid, function() {
                            handleSave(success, data);
                        });
                    };
                });
            }
        }

        /** CalCentral specific code END **/

        $rootel.on('input change cut paste', function() {
            enableUpdate();
        });

        var getData = function(callback) {
            if (editing && sakai.data.me.profile && $.isFunction(callback) && sakai.data.me.profile._fullProfileLoaded) {
                callback(true, sakai.data.me.profile);
            } else {
                sakai.api.User.getUser(userid, function(success, data) {
                    if (sakai.data.me.user.userid === data.userid) {
                        sakai.data.me.profile = data;
                        sakai.data.me.profile._fullProfileLoaded = true;
                    }
                    if ($.isFunction(callback)) {
                        callback(success, data);
                    }
                });
            }
        };

        var init = function() {
            userid = sakai_global.profile.main.data.userid;
            // LOTS of modifications done throughout widget for CalCentral. Refer to:
            // MYB-1658 for more information.
            isMe = sakai.data.me.user.userid === userid;
            getData( renderSection );
        };

        init();
    };

    sakai.api.Widgets.widgetLoader.informOnLoad("displayprofilesection");
});
