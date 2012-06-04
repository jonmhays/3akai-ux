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
 global $, jQuery, sakai
 */

require(
    [
        'jquery',
        'sakai/sakai.api.core',
        '/devwidgets/quicklinks/javascript/default-links.js'
    ],
    function($, sakai, defaultLinks) {

   /**
     * @name sakai_global.quicklinks
     *
     * @class quicklinks
     *
     * @description
     * The 'quicklinks' widget displays "Quicklinks" a set of campus links
     * and allows the user to add thier own links to the My Links pane
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     */
    sakai_global.quicklinks = function(tuid) {

        /** VARIABLES. **/

        /** DOM elements. Configurable but be aware of validator dependencies. */
        var $widgetContainer =  $('#' + tuid);
        var $linkTitleInput = $('#quicklinks-link-title' , $widgetContainer); //value attached to validator fn, remember to match.
        var $linkUrlInput = $('#quicklinks-link-url', $widgetContainer); //value attached to validator fn, remember to match.
        var $saveLinkKeydownClass = $('.quicklinks-save-link-keydown', $widgetContainer);
        var $addEditPanel = $('.quicklinks_addedit_link_panel', $widgetContainer);
        var $addEditPanelTitle = $('.quicklinks_addedit_link_panel_title' , $widgetContainer);
        var $saveLinkButton = $('#quicklinks-savelink-button', $widgetContainer);
        var $addLinkButton = $('#quicklinks-addlink-button', $widgetContainer);
        var $saveLinkClickClass = $('.quicklinks-save-link-click', $widgetContainer);
        var $accordionContainer = $('#quicklinks_accordion', $widgetContainer);
        var $addLinkModeBtn = $('#quicklinks-add-link-mode', $widgetContainer);
        var $cancelButton = $('#quicklinks-cancel-button', $widgetContainer);
        var $myLinksFormId = $('#quicklinks-form', $widgetContainer);

        /** js keydown code for the ENTER key. */
        var ENTER_KEY = 13;

        /** js keydown code for the ESC key. */
        var ESC_KEY = 27;

        /** the user's own links ("My Links"). Specified by default-links.js JSON source. **/
        var userLinkData = defaultLinks.sections[defaultLinks.userSectionIndex];

        /** END VARIABLES. **/


        /** Utility Functions. **/

        /**
         * Call the jquery Validator plugin funciton to validate the form. Simplifies some form validation messaing
         * and more.
         *
         * @type Validator object (http://docs.jquery.com/Plugins/Validation#Validator).
         */
        var validator = $myLinksFormId.validate({
            rules: {
                'quicklinks-link-title': {
                    required: true
                },
                'quicklinks-link-url': {
                    required: true,
                    url: true,
                    appendhttp: true
                }
            }
        });

        /** Main View Functions. **/
        /**
         * Load user's list if there is one, and merge it with the default links. If no user's list, just use
         * the default ones. Will also initialize and save a default user list on the first load to prevent continued
         * warning messages from loading for subsequent reloads.
         *
         * @return {undefined} modifies the defaultLinks object by merging in the user link data. Also manipulates the dom
         * by trigging renderLinkList to show the updated defaultLinks object.
         */
        var loadUserList = function() {
            sakai.api.Widgets.loadWidgetData(tuid, function (success, data) {
                if (success) {
                    // merge the user's links with the default links
                    userLinkData = data;
                    // if userLinkData is not an array then load it with an empty array
                    if (!$.isArray(userLinkData.links)) {
                        userLinkData.links = [];
                    }
                    defaultLinks.sections[defaultLinks.userSectionIndex] = userLinkData;
                } else {
                    userLinkData.activeSection = 0;
                    //attempting to initialize user object for subsequent loads.
                    sakai.api.Widgets.saveWidgetData(tuid, userLinkData, function (success) {
                        if (!success) {
                            sakai.api.Util.notification.show('',
                                sakai.api.i18n.getValueForKey('SERVER_ERROR_INITIALIZE_USER_OBJECT', 'quicklinks'),
                                sakai.api.Util.notification.type.ERROR, false);
                        }
                    });
                }
                defaultLinks.activeSection = userLinkData.activeSection;
                renderLinkList(defaultLinks);
            });
        };


        /**
         * Add a new link OR edit an existing link to/on the user's "My Links" pane.
         *
         * @return {undefined} modified userLinkData json object with new link updates. Also refreshes the pane list.
         */
        var saveLink = function() {
            if ($addLinkButton.attr('disabled') === 'true') {
                return;
            }
            var isValid = validator.form();
            if (isValid) {
                $saveLinkClickClass.attr('disabled', true);

                var index = $myLinksFormId.attr('data-eltindex');

                index = index || userLinkData.links.length;

                userLinkData.links[index] = {
                    'name' : $linkTitleInput.val(),
                    'url' : $linkUrlInput.val(),
                    'popup_description': $linkTitleInput.val()
                };
                defaultLinks.sections[defaultLinks.userSectionIndex] = userLinkData;

                sakai.api.Widgets.saveWidgetData(tuid, userLinkData, function(success) {
                    if (success) {
                        cancelEditMode();
                        renderLinkList(defaultLinks);
                    } else {
                        sakai.api.Util.notification.show('', sakai.api.i18n.getValueForKey('SERVER_ERROR_SAVE_LINK', 'quicklinks'),
                                sakai.api.Util.notification.type.ERROR, false);
                    }
                });
            }
        };

        /** Event Handlers. */

        /**
         * Runs once upon widget initialization. Will set the default common button and keystroke events
         * for the widget.
         *
         * @return {undefined} buttons and keys common to the widget are bound to event handlers and their respective functions.
         */
        var setupEventHandlers = function() {
            $addLinkModeBtn.on('click', enterAddMode);

            $cancelButton.on('click', cancelEditMode);

            $saveLinkClickClass.on('click', saveLink);

            $saveLinkKeydownClass.on('keydown', function (event) {
                if (event.keyCode === ENTER_KEY) {
                    event.preventDefault();
                    saveLink();
                } else if (event.keyCode === ESC_KEY) {
                    event.preventDefault();
                    cancelEditMode();
                }
            });
        };

        /**
         * Called when the quicklinks widget needs to be rendered or reloaded with new data.
         *
         * @param {Object} data defaultLinks json object with possible custom user links.
         * @return {undefined}  rendered quicklinks accordion div.
         */
        var renderLinkList = function(data) {
            $accordionContainer.html(sakai.api.Util.TemplateRenderer('quicklinks_accordion_template', data));
            setupAccordion();
            setupEditIcons();
        };

        /**
         * Modifies the title for the add/edit link form.
         *
         * @param {String} title string to set the title to.
         */
        var setAddEditLinkTitle = function(title) {
            $addEditPanelTitle.text(title);
        };


        /**
         * Cancels the editing mode and returns to the accordion panes.
         *
         * @return {undefined} return to accordion panes
         */
        var cancelEditMode = function() {
            validator.resetForm();
            $addEditPanel.hide();
            $myLinksFormId.attr('data-eltindex', '');
            $('label.error', $widgetContainer).hide();
            $saveLinkClickClass.attr('disabled', false);
        };

        /**
         * Enters the mode to add a new link.
         * @return {undefined} New modal div that will allow a user to add a new link.
         */
        var enterAddMode = function() {
            showPane($('.accordion_pane:last'));
            setAddEditLinkTitle(sakai.api.i18n.getValueForKey('ADD_LINK', 'quicklinks'));
            $myLinksFormId.attr('data-eltindex', '');
            $addEditPanel.show();
            $addLinkButton.show();
            $saveLinkButton.hide();
            $linkTitleInput.focus();
        };

        /**
         * Enters the mode to edit an existing link.
         * @param {int} index index of the link in the user list of links.
         * @return {undefined}  New modal div that will allow a user to modify an existing link.
         */
        var enterEditMode = function(index) {
            var link = userLinkData.links[index];
            setAddEditLinkTitle(sakai.api.i18n.getValueForKey('EDIT_LINK', 'quicklinks'));
            $linkTitleInput.val(link.name);
            $linkUrlInput.val(link.url);
            $myLinksFormId.attr('data-eltindex', index);
            $addEditPanel.show();
            $addLinkButton.hide();
            $saveLinkButton.show();
            $linkTitleInput.focus();
        };


        /**
         * Iterates through all the existing my links to append the edit link and delete link buttons.
         * Called whenever the accordion menu has to be rendered.
         *
         * @return {undefined} edit and delete buttons on each link are attached to event handlers and their respective functions.
         */
        var setupEditIcons = function() {
            $('.edit-mylink', $widgetContainer).on('click', function() {
                var idx = $(this).attr('data-eltindex');
                enterEditMode(idx);
            });

            $('.delete-mylink', $widgetContainer).on('click', function() {
                var idx = $(this).attr('data-eltindex');
                userLinkData.links.splice(idx, 1);
                defaultLinks.sections[defaultLinks.userSectionIndex] = userLinkData;
                sakai.api.Widgets.saveWidgetData(tuid, userLinkData, function(success) {
                    if (success) {
                        renderLinkList(defaultLinks);
                    } else {
                        sakai.api.Util.notification.show('', sakai.api.i18n.getValueForKey('SERVER_ERROR_DELETE_LINK', 'quicklinks'),
                                sakai.api.Util.notification.type.ERROR, false);
                    }
                }, true);
            });
        };

        /**
         * Show a specific pane
         * @param {jquery selector} $pane jquery selector for a specific pane to show.
         * @return {undefined}  opens up the pane specified by the $pane argument.
         */
        var showPane = function ($pane) {
            if (!$pane.hasClass('accordion_open')) {
                closePanes();
                $pane.addClass('accordion_open');
            }
            $pane.children('.accordion_content').slideDown(300, function() {
                $pane.children('.accordion_content').css('overflow', 'auto');
            });

            var previousActiveSection = userLinkData.activeSection;
            if ($pane.length) {
                userLinkData.activeSection = parseInt($pane.attr('data-sectionid'), 10);
            } else {
                userLinkData.activeSection = 0;
            }
            defaultLinks.activeSection = userLinkData.activeSection;
            if (previousActiveSection !== userLinkData.activeSection) {
                // save active section only if it's different
                sakai.api.Widgets.saveWidgetData(tuid, userLinkData);
            }
        };

        /**
         * Hide a specific pane
         * @param {jquery selector} $pane jquery selector for a specific pane to hide.
         * @return {undefined}  collapses a pane that was open.
         */
        var hidePane = function ($pane) {
            $pane.removeClass('accordion_open');
            $pane.children('.accordion_content').slideUp(300);
        };

        /**
         * Iterates through all the accordion container panes and closes them all.
         * @return {undefined} closes all the panes.
         */
        var closePanes = function () {
            $('.accordion_pane', $accordionContainer).each(function () {
                hidePane($(this));
            });
        };

        /**
         * Setup the event handlers on the accordion container titles, as well as
         * tracking analytics on the individual link elements.
         *
         * @return {undefined} accordion menu with click handlers configured.
         */
        var setupAccordion = function() {
            $('.section_label', $accordionContainer).on('click', function() {
                showPane($(this).parent());
            });

            if ($accordionContainer.width() > 250) {
                $accordionContainer.addClass('link_grid');
            }

            showPane($('.accordion_open', $accordionContainer));
        };

        /** Initialization Function. */
        var doInit = function() {
            loadUserList();
            setupEventHandlers();
        };

        // run doInit() function when sakai_global.quicklinks object loads
        doInit();
    };

    sakai.api.Widgets.widgetLoader.informOnLoad('quicklinks');

});
