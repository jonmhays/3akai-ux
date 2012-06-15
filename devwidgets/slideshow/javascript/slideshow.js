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

// load the master sakai object to access all Sakai OAE API methods
require(["jquery", "sakai/sakai.api.core", "/devwidgets/slideshow/javascript/camera.min.js", "/devwidgets/slideshow/javascript/jquery.easing.1.3.js"], function($, sakai) {

    /**
     * @name sakai_global.slideshow
     *
     * @class slideshow
     *
     * @description
     * Slideshow is a page widget that displays a collection of images
     * using the camera.js slideshow
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.slideshow = function (tuid, showSettings) {

        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        // DOM jQuery Objects
        var $rootel = $("#" + tuid);  // unique container for each widget instance
        var $mainContainer = $("#slideshow_main", $rootel);
        var $settingsContainer = $("#slideshow_settings", $rootel);
        var $settingsForm = $("#slideshow_settings_form", $rootel);
        var $cancelSettings = $("#slideshow_cancel_settings", $rootel);
        var $collectionList = $("#slideshow_collection_list", $rootel);

        // Place all widget settings in this object
        var widgetSettings = {};
        var collections = {};

        // Containers
        var $slideshowSettingsContainer = $("#slideshow_settings_container",$rootel);
        var $slideshowMainContainer = $("#slideshow_main_container",$rootel);
        var $slidesContainer = $("#slideshow_slides_container",$rootel)

         // Templates
        var $slideshowSettingsTemplate = $("#slideshow_settings_template", $rootel);
        var $slideshowMainTemplate = $("#slideshow_main_template", $rootel);

        ///////////////////////
        // Utility functions //
        ///////////////////////


        //get a list of collections for the current user
        var getCollectionList = function(callback) {
            sakai.api.Content.Collections.getMyCollections(0, 100, function(returnvalue) {
                collections = returnvalue.results;
                getSettings();
            });
        };

        /**
         * Gets the settings from the server using an asynchronous request
         *
         * @param {Object} callback Function to call when the request returns. This
         * function will be sent an object with the settings for this widget.
         */
        var getSettings = function (callback) {
            // get the data associated with this widget
                sakai.api.Widgets.loadWidgetData(tuid, function(success, data){
                    if (success) {
                        widgetSettings = data;
                        if (showSettings) {
                            showSettingsView();
                        } else {
                            showMainView(widgetSettings);
                        }
                    } else {
                        showSettingsView();
                    }

                });
        };

        //Find all images associated to the selected collection
        var getImages = function(collection) {
            // render the images from a collection
            var userid = 'c-' + collection;

            $.ajax({
                type: "GET",
                url: sakai.config.URL.POOLED_CONTENT_SPECIFIC_USER,
                data: {
                    "page": 0,
                    "items": 20,
                    "userid": userid,
                },
                success: function(data) {
                    images = data.results;
                    sakai.api.Util.TemplateRenderer($slideshowMainTemplate, images, $slideshowMainContainer);
                    // form elements that return strings need to be transformed
                    var autoAdvance = (widgetSettings.autoAdvance === 'true')? true : false;
                    var slideshowEffect = widgetSettings.slideshowEffect;

                    //load the camera slideshow viewer
                    $slideshowMainContainer.camera({
                        height: '68%',
                        portrait: true,
                        pagination: true,
                        thumbnails: true,
                        hover: false,
                        fx: slideshowEffect,
                        autoAdvance: autoAdvance,
                        opacityOnGrid: false
                    });
                }
            });

        };

        /////////////////////////
        // Main View functions //
        /////////////////////////

        /**
         * Shows the Main view that contains the Hello World text colored in the
         * provided color argument
         *
         * @param {String} color The hex value of the color to set the text
         * (i.e. "#00FF00")
         */
        var showMainView = function (data) {
            getImages(widgetSettings.collectionID);

            // show the Main container
            $mainContainer.show();
        };


        /////////////////////////////
        // Settings View functions //
        /////////////////////////////

        /**
         * Sets the form elements in the Settings
         *
         * @param {Object} collectionID is the string value for a collection
         */
        var showSettingsView = function (data) {
            console.log(widgetSettings.autoAdvance);

            sakai.api.Util.TemplateRenderer($slideshowSettingsTemplate, {
                "settings": widgetSettings,
                "sakai": sakai,
                "collections": collections
            }, $slideshowSettingsContainer);
            //set the collection
            //$('.slideshow_auto_advance [value=' + widgetSettings.autoAdvance + ']', $rootel).attr('checked', 'checked');
            //$('.slideshow_effect [value=' + widgetSettings.slideshowEffect + ']', $rootel).attr('selected', 'selected');
            $('#slideshow_collection_list').val(widgetSettings.collectionID);
            //$('.slideshow_auto_advance').prop("checked", true);
            //:checked"
            //val(widgetSettings.autoAdvance);

            $settingsContainer.show();
        };

        ////////////////////
        // Event Handlers //
        ////////////////////

        /** Binds Settings form */
        $settingsForm.on('submit', function (ev) {
            // get the selected collection
            //widgetSettings['collectionID'] = $collectionList.val();
            widgetSettings['collectionID'] = $("#slideshow_collection_list", $rootel).val();
            widgetSettings['autoAdvance'] = $(".slideshow_auto_advance input[type='radio']:checked", $rootel).val();
            // save the settings
            sakai.api.Widgets.saveWidgetData(tuid, widgetSettings,
                function (success, data) {
                    if (success) {
                        // Settings finished, switch to Main view
                        sakai.api.Widgets.Container.informFinish(tuid, "slideshow");
                    }
                }
            );
            return false;
        });

        $cancelSettings.bind('click', function(){
            sakai.api.Widgets.Container.informFinish(tuid, "slideshow");
        });


        /////////////////////////////
        // Initialization function //
        /////////////////////////////

        /**
         * Initialization function that is run when the widget is loaded. Determines
         * which mode the widget is in (settings or main), loads the necessary data
         * and shows the correct view.
         */
        var doInit = function () {

            if (showSettings) {
                getCollectionList();
            } else {
                getSettings();
            }

        };

        // run the initialization function when the widget object loads
        doInit();
    };

    // inform Sakai OAE that this widget has loaded and is ready to run
    sakai.api.Widgets.widgetLoader.informOnLoad("slideshow");
});
