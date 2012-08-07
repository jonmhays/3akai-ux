/*
 * Copyright 2012:
 *     - Rachel Hollowgrass <rhollow@berkeley.edu>
 *     - ETS, University of California, Berkeley
 *
 *     Modification of work by
 *     - Hal Blackburn<hwtb2@caret.cam.ac.uk>
 *     - CARET, University of Cambridge
 *
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

/*jslint vars: true, nomen: true, maxerr: 50, maxlen: 80, indent: 4 */
/*jslint plusplus: true */

// var require, sakai_global, alert;
require(['jquery', 'sakai/sakai.api.core', '/devwidgets/cccalendarfeed/lib/ccdates.js','/devwidgets/cccalendarfeed/lib/jquery.ui.slider.js'], function($, sakai, dates) {

	/**
	 * A Sakai OAE widget which shows calendar events from an iCalendar feed in a
	 * daily agenda list style view.
	 *
	 * @param {String}
	 *            tuid Unique id of the widget
	 * @param {Boolean}
	 *            showSettings Show the settings of the widget or not
	 */
	sakai_global.cccalendarfeed = function (tuid, showSettings) {
	    "use strict";

	    // JSLint complains if we don't declare all our var based functions before
	    // use...
	    var between,
			calendarDataFileIsNotLoading,
            calendarDataHasBeenLoaded,
            checkNumberOfColumns,
	        compareEventByStartDate,
	        contractCalendarEntry,
	        defaultingStateLoadHandler,
	        doInit,
            entries,
            events,
            eventsCurrent,
	        expandCalendarEntry,
	        fetchCalendarData,
	        filterEvents,
	        getState,
	        groupByDay,
	        hideLoadingIndicator,
	        icsFileIsNotLoading,
	        isFinite,
	        localiseDate,
	        nextItem,
	        notBefore,
	        onStateAvailable,
	        onWidgetSettingsDataSaved,
	        onWidgetSettingsStateAvailable,
	        paragraphBreak,
	        parseEventDates,
	        rewriteHttpUrlToWebcal,
	        rewritePathIfNeeded,
	        rewriteWebcalUrlToHttp,
	        runCalendarDataLoadTimeout,
	        settingsHandleRangeSlide,
	        settingsSave,
	        setupRangeSlider,
	        showError,
	        showLoadingIndicator,
			updateCalendar,
			urlIsGoogleFeed;

	    /**
	     * No-op function which can be called with unused function arguments whose
	     * presense are required by external APIs which this code has control over.
	     *
	     *  JSLint thinks it's helpful to moan that an argument is unused, even
	     *  though its presence can't be avoided without stupid hacks like using the
	     *  arguments array.
	     */
	    var stopJSLintMoaningAboutThisUnusedVarWhichICanDoNothingAbout =
	        function () {};

	    /**
	     * Get an internationalisation value from the widget's bundle.
	     */
	    var translationOf = function (key) {
	        return sakai.api.i18n.getValueForKey(key, "cccalendarfeed");
	    };

	    var ICAL_PROXY_PATH = "/var/proxy/ical.json";

	    // By default show events from 2 days ago up to 2 weeks in the future
	    var DEFAULT_DISPLAY_RANGE = [ -2, 14 ];
	    var MIN_SLIDER_DATE = -61;
	    var MAX_SLIDER_DATE = 61;

	    var ERROR_UNCONFIGURED_BODY = translationOf("ERROR_UNCONFIGURED_BODY");
	    var ERROR_GETTING_STATE = translationOf("ERROR_GETTING_STATE");
	    var ERROR_GETTING_FEED = translationOf("ERROR_GETTING_FEED");
	    var ERROR_MESSAGE_TITLE = translationOf("ERROR_MESSAGE_TITLE");

        events = [];
        eventsCurrent = [];
	    
	    /*
	     * This widget couldn't get through to the website. The site may by
	     * experiencing difficulties, or there may be a problem with your internet
	     * connection.
	     *
	     * The chances are this will resolve itself very soon. Press the retry
	     * button and cross your fingers…
	     */

	    // ///////////////////////////
	    // Configuration variables //
	    // ///////////////////////////

	    // unique container for each widget instance
	    var root = $("#" + tuid);
	    var mainContainer = $("#cccalendarfeed_main", root);
	    var settingsContainer = $("#cccalendarfeed_settings", root);
	    var settingsForm = $("#cccalendarfeed_settings_form", root);
	    var settingsFormTitleField = $("#cccalendarfeed_settings_txtTitle", root);
	    var settingsFormUrlField = $("#cccalendarfeed_settings_txtUrl", root);

	    // Widget state vars
	    var _title = null;
	    var _feedUrl = null;
	    var _groupedDays = null;
	    var _totalFeedEvents = null;
	    var _isInThreeColumnView = null;

	    // Settings state
	    var _settingsDateRange = null;

	    /**
	     * A class to represent events.
	     */
	    function Event(vevent) {

	        // To do: Needs be modified to work with VFREEBUSY instead of VEVENT.
	        this.vevent = vevent;
	        this.absDate = dates.buildAbsoluteDateString(vevent.startTime);
	        this.dayDelta = dates.dayDelta(dates.today(), vevent.startTime);
	        this.relDate = dates.buildRelativeDateString(this.dayDelta);
	        this.time = dates.buildTimeString(vevent.startTime);
	        this.summary = vevent.SUMMARY || "";
	        this.url = vevent.URL || "";
	        this.description = vevent.DESCRIPTION || "";
	        this.description = paragraphBreak(this.description);

	        // These fields may be undefined
	        this.location = vevent.LOCATION;
	        this.hasDetails = vevent.hasDetails;
	    }

	    // /////////////////////
	    // Utility functions //
	    // /////////////////////

	    /**
	     * Converts a date from an UTC into the user's chosen timezone.
	     */
	    localiseDate = function (utcdate) {
	        return sakai.api.l10n.fromGMT(utcdate, sakai.api.User.data.me);
	    };

	    paragraphBreak = function (text) {
	        // Break the text on blank lines
	        return text.split(/^\s*$/m);
	    };

	    /**
	     * Builds a callback function to be passed to loadWidgetData which detects
	     * load failure due to no previous state being saved and calls the callback
	     * with success and some default values instead of failure.
	     *
	     * By default, loadWidgetData makes no distinction between failure to load
	     * state due to the widget being loaded for the first time, and failure due
	     * to network error (for example).
	     */
	    defaultingStateLoadHandler = function (callback, defaults) {
	        // Return a callback function to be registered with loadWidgetData
	        return function (success, obj) {
	            if (!success) {
	                var xhr = obj;

	                // Check for failure to load due to no previous state being
	                // saved. i.e. use defaults.
	                if (xhr.status === 404) {
	                    // fire the callback with success instead of failure
	                    // using the defaults provided
	                    callback(true, defaults);
	                } else {
	                    // Otherwise, assume it's a legitimate failure
	                    callback(false, xhr);
	                }
	            } else {
	                callback(true, obj);
	            }

	        };
	    };

	    /**
	     * Shows an error message with the given error body. postInsertHook will be
	     * called once the message has been inserted with the error body as its this
	     * value.
	     */
    showError = function (bodyHtml, postInsertHook) {
        var rendered = sakai.api.Util.TemplateRenderer("#template_error_msg", {
            title : ERROR_MESSAGE_TITLE,
            body : bodyHtml
        });
        var errorElement = $("#error_msg", root);
        $("#error_msg", root).html(rendered).slideDown();
        if (postInsertHook) {
            postInsertHook.call(errorElement);
        }
    };

	    /**
	     * Called when the widget state becomes available to the main widget (not
	     * settings).
	     */
	    onStateAvailable = function (succeeded, state) {
	        // Check if the request for our state failed...
	 	    if (!succeeded || calendarDataFileIsNotLoading) {

	            hideLoadingIndicator();

	            return showError(ERROR_GETTING_STATE, function () {
	                $("#error_msg #error_retry_btn", root).click(function (e) {
	                    // re initialise after finishing hiding the error msg
	                    $(e.target).slideUp(doInit);
	                });
	            });
	        }

	        // Check if the widget is yet to be configured, and if so show a
	        // message.
	        if (state.unconfigured) {
	            hideLoadingIndicator();
	            return showError(ERROR_UNCONFIGURED_BODY);
	        }

	        // Should be all good!
	        _title = state.title;
	        _feedUrl = state.url;
	        _settingsDateRange = [ state.daysFrom, state.daysTo ];
	        fetchCalendarData();
	    };

	    fetchCalendarData = function () {
            var success;
            var failure;

    	    /**
	         * Expected URLs can be of this form:
	         * 'http://www.google.com/calendar/feeds/berkeley.edu_di5bkdrobcvs6hb19d0em2u2r4%40group.calendar.google.com/private-d26a6c6784dc83a309c482a7bdf987cd/basic'
	         * 
	         * They can be transformed by rewritePathIfNeeded as this:
	         * 'https://www.google.com/calendar/feeds/berkeley.edu_di5bkdrobcvs6hb19d0em2u2r4%40group.calendar.google.com/private-d26a6c6784dc83a309c482a7bdf987cd/full?alt=json'
	         */

            _feedUrl = rewritePathIfNeeded(_feedUrl);
            if (urlIsGoogleFeed) {
				$.getJSON(_feedUrl, function(data){
					if (data.feed.entry) {
                        calendarDataHasBeenLoaded = true;

						entries = data.feed.entry;
						_totalFeedEvents = entries.length;
	
						if (_totalFeedEvents === null) { 
							calendarDataFileIsNotLoading = true;
						} else {
							_totalFeedEvents = entries.length;
							calendarDataFileIsNotLoading = false;
		
							// Convert event date strings into date objects
							$.each(entries, function(i, item){
								events[i] = {
									SUMMARY : item.title.$t,
									DTSTART : item.gd$when[0].startTime,
									DTEND : item.gd$when[0].endTime,
									DESCRIPTION : item.content.$t || null,
									LOCATION : item.gd$where[0].valueString  || null,
									URL : null,
									startTime : new Date(item.gd$when[0].startTime),
									hasDetails : false
								}
	
								events[i].hasDetails =  ((events[i].DESCRIPTION != null) || (events[i].LOCATION != null));
								
							});
	
                            filterEvents(events);

						}
					}
	
				});
				$.ajax({
					url : _feedUrl,
					data : {
						feedurl : _feedUrl
					},
					success : success,
					failure : failure
				});
			} else {

				var failure = function () {
					hideLoadingIndicator();
					showError(ERROR_GETTING_FEED, function () {
						// Bind the "try again" button to hide the error message
						// and retry the operation.
						$("#error_msg #error_retry_btn", root).click(function () {
	
							$("#error_msg", root).slideUp(function () {
								// Once the error box has slid away, show the
								// loading wheel and fetch the data again.
								showLoadingIndicator();
								fetchCalendarData();
							});
						});
	
					});
				};
				var success = function (data) {
					// The proxy's iCalendar post processor is broken -- it returns
					// 200 success when it gets a bad response from the origin
					// server... We'll have to attempt to detect failure here:
					if (!data) {
						return failure();
					}
	
                    calendarDataHasBeenLoaded = true;
					// Hopefully the data is OK.
					if (data.vcalendar && data.vcalendar.vevents) {
						var events = data.vcalendar.vevents;
						_totalFeedEvents = events.length;
					
						if (_totalFeedEvents === null) { 
							icsFileIsNotLoading = true;
						} else {
							_totalFeedEvents = events.length;
							icsFileIsNotLoading = false;
	 
							// Convert event date strings into date objects
							$.each(events, function(i, item){
								events[i] = {
									SUMMARY : item.SUMMARY,
									DTSTART : item.DTSTART,
									DTEND : item.DTEND || null,
									DESCRIPTION : item.DESCRIPTION || null,
									LOCATION : item.LOCATION || null,
									URL : item.URL || null,
									startTime : new Date(item.DTSTART),
									endDate : new Date(item.DTEND),
									hasDetails : false
								}
	
								events[i].hasDetails =  ((events[i].DESCRIPTION != null) || (events[i].LOCATION != null) || (events[i].URL != null));
							});
								
                            filterEvents(events);
						}
					}

				};

					$.ajax({
						url : ICAL_PROXY_PATH,
						data : {
							feedurl : _feedUrl
						},
      
						error: function(a,b,c){
							var feedError = true;
   						},
					    success : success,
    					failure : failure
					});
			
			}

	    };


	    filterEvents = function (events) {
			// Filter the events to just those happening today
			var range = (_settingsDateRange || DEFAULT_DISPLAY_RANGE);
			var startDate = (isFinite(range[0]) ?
					dates.addDays(dates.today(), range[0]) : null);
			// add one as between() excludes the upper endpoint, but the
			// slider is inclusive.
			var endDate = (isFinite(range[1]) ?
					dates.addDays(dates.today(), range[1] + 1) : null);
			var j = 0;
			$.each(events, function(i, item){							 
				if ((item.startTime >= startDate) && (item.startTime < endDate)) {
					eventsCurrent[j] = item;
					j++;
				}
			});

			// Group the events into a list of groups, one for each day
			_groupedDays = groupByDay(eventsCurrent);

	    };

	    isFinite = function (dayDelta) {
	        return dayDelta < MAX_SLIDER_DATE && dayDelta > MIN_SLIDER_DATE;
	    };

	    /**
	     * Convert date strings from a JSON originating event object into js Date
	     * objects in the current user's prefered time zone.
	     */
	    notBefore = function (date) {
	        return function (event) {
	            return event.DTSTART >= date;
	        };
	    };

	    compareEventByStartDate = function (a, b) {
	        return a.vevent.startTime.getTime() - b.vevent.startTime.getTime();
	    };

	    groupByDay = function (vevents) {
			var i, key, days = {};
			for (i = 0; i < vevents.length; ++i) {
				var event = vevents[i];
				// We need a string to key our obj with
				var dateKey = dates.stripTime(event.startTime).toISOString();
				if (!days[dateKey]) {
					days[dateKey] = [];
				}
				days[dateKey].push(new Event(event));
			}
			var sortedDays = [];
			for (key in days) {
				if (days.hasOwnProperty(key)) {
					var events = days[key];
					events.sort(compareEventByStartDate);
					sortedDays.push([ key, events ]);
				}
			}
			sortedDays.sort();
			return sortedDays;
	    };

	    /**
	     * Loads widget saved state, calling the callback(success, data) function
	     * once the state is loaded.
	     */
	    getState = function (callback) {
	        // Load widget data, providing default values on loads before state
	        // has been saved on the server.
	        sakai.api.Widgets.loadWidgetData(tuid, defaultingStateLoadHandler(
	            callback,
	            {
	                unconfigured : true,
	                title : "",
	                url : "",
	                daysFrom : DEFAULT_DISPLAY_RANGE[0],
	                daysTo : DEFAULT_DISPLAY_RANGE[1]
	            }
	        ));
	    };

	    /** Called when the calendar data has been updated. */
	    updateCalendar = function () {
            if (calendarDataHasBeenLoaded) {
				var rendered = sakai.api.Util.TemplateRenderer("#agenda_template", {
					title : _title,
					//webcalFeedUrl : rewriteHttpUrlToWebcal(_feedUrl),
					days : _groupedDays,
					totalFeedEvents : _totalFeedEvents,
					isInThreeColumnView : _isInThreeColumnView
				});
	
				$(".ajax-content", root).html(rendered);
	
				$(".ajax-content .summary.compact", root).toggle(
					expandCalendarEntry,
					contractCalendarEntry
				);
	
				$(".ajax-content", root).show();
				hideLoadingIndicator();
	
				$("#title", root).hover(function (e) {
					$(e.target).children().fadeIn();
				}, function (e) {
					$(e.target).children().fadeOut();
				});
				calendarDataHasBeenLoaded = false;
			}
	    };

	    hideLoadingIndicator = function () {
	        $(".loading", root).stop().hide();
	    };

	    showLoadingIndicator = function () {
	        $(".loading", root).fadeIn(1000);
	    };

	    expandCalendarEntry = function (e) {
	        var summary = $(e.target);
	        var expanded = summary.siblings(".full");

	        summary.removeClass("compact expandable").addClass("contractable");
	        expanded.slideDown();
	    };

	    contractCalendarEntry = function (e) {
	        var summary = $(e.target);
	        var expanded = summary.siblings(".full");

	        summary.addClass("compact expandable").removeClass("contractable");
	        expanded.slideUp();
	    };

	    /**
	     * Watch for value changes to the settings URL field in order to rewrite
	     * webcal:// urls to http://.
	     */
	    settingsFormUrlField.change(function (e) {
	        var urltext = $(e.target).val();
	        // Help people inputting webcal:// links by rewriting them to http
	        urltext = rewritePathIfNeeded(urltext);
	        $(e.target).val(urltext);
	    });

	    rewriteWebcalUrlToHttp = function (url) {
	        return url.replace(/^webcal:\/\//, "http://");
	    };

	    rewriteHttpUrlToWebcal = function (url) {
            if (!urlIsGoogleFeed) {
				// This causes trouble for the Validator default url rule.
				// To do: Write a more expansive rule for this part of html:
				//<input type="text" id="cccalendarfeed_settings_txtUrl"
                //    name="rss_settings_txtUrl"
                //    class="required s3d-input-full-width" />

		        return url.replace(/^https:\/\//, "webcal://");
			} else {
    			return url;			
			}
	    };

        // The XML string that Google Calendar supplies needs to be edited to supply JSON.
        rewritePathIfNeeded = function (url) {
            
            var googlePrefix1_pattern = /^http:\/\/www.google.com\//i;
            var googlePrefix2_pattern = /^https:\/\/www.google.com\//i;

            var googleICALPrefix_pattern = /^http:\/\/www.google.com\/calendar\/ical\//i;
            var googleICALSuffix_pattern = /\/basic.ics$/i;
            
            var googleXMLPrefix_pattern = /^http:\/\/www.google.com\/calendar\/feeds\//i;
            var googleXMLSuffix_pattern = /\/basic$/i;

            var googlePrefix_replace = 'https://www.google.com/calendar/feeds/';
            var googleSuffix_replace = '/full?alt=json&orderby=starttime&singleevents=true&sortorder=ascending';
                        
//var url1 = url;
            if (url.match(googlePrefix1_pattern) || url.match(googlePrefix2_pattern)) {
                urlIsGoogleFeed = true;
            } else {
                // Assume that URL is a static ics file feed.
                urlIsGoogleFeed = false;
            }

			if (urlIsGoogleFeed) {
				if (url.match(googleICALPrefix_pattern)) {
					// Assume that URL is ical from Google Calendar.
					url = url.replace(googleICALPrefix_pattern, googlePrefix_replace);
					url = url.replace(googleICALSuffix_pattern, googleSuffix_replace);
				} else if (url.match(googleXMLPrefix_pattern)) {
					// Assume that URL is XML from Google Calendar.
					url = url.replace(googleXMLPrefix_pattern, googlePrefix_replace);
					url = url.replace(googleXMLSuffix_pattern, googleSuffix_replace);
				}
			}

            return url;
        };

        onWidgetSettingsStateAvailable = function (success, state) {
	        var title, url;
	        if (success) {
                title = state.title;
                url = state.url;
	            if (state.daysFrom && state.daysTo) {
	                _settingsDateRange = [ state.daysFrom, state.daysTo ];
	            }
	        } else {
	            alert(translationOf("SETTINGS_ERROR_FETCHING_WIDGET_STATE"));
	        }
	        settingsFormTitleField.val(title || "");
	        settingsFormUrlField.val(url || "");
	        setupRangeSlider($("#daterangeslider", root),
	                settingsHandleRangeSlide);
	        $("#daterangeslider", root).slider("values",
	                _settingsDateRange || DEFAULT_DISPLAY_RANGE);
	    };

	    /** Add listener to setting form submit */
	    settingsSave = function () {
	        var state = {
	            title : settingsFormTitleField.val(),
	            url : settingsFormUrlField.val(),
	            daysFrom : _settingsDateRange[0],
	            daysTo : _settingsDateRange[1]
	        };

	        // async save our widget's state
	        sakai.api.Widgets.saveWidgetData(tuid, state, onWidgetSettingsDataSaved);
	    };

	    onWidgetSettingsDataSaved = function (success) {
	        if (success) {
	            // Settings finished, switch to Main view
	            sakai.api.Widgets.Container.informFinish(tuid, "cccalendarfeed");
	        } else {
	            sakai.api.Util.notification.show(
	                translationOf("SETTINGS_ERROR_SAVING_WIDGET_STATE_TITLE"),
	                translationOf("SETTINGS_ERROR_SAVING_WIDGET_STATE_BODY"),
	                sakai.api.Util.notification.type.ERROR
	            );
	        }
	    };

	    setupRangeSlider = function (container, slideFunc) {
	        stopJSLintMoaningAboutThisUnusedVarWhichICanDoNothingAbout(container);
	        $("#daterangeslider", root).slider({
	            range : true,
	            min : MIN_SLIDER_DATE,
	            max : MAX_SLIDER_DATE,
	            values : _settingsDateRange || DEFAULT_DISPLAY_RANGE,
	            slide : slideFunc,
	            change : slideFunc
	        });
	    };

	    settingsHandleRangeSlide = function (event, ui) {
	        stopJSLintMoaningAboutThisUnusedVarWhichICanDoNothingAbout(event);
	        _settingsDateRange = ui.values;
	        var from = ui.values[0];
	        var to = ui.values[1];

	        var fromString = !isFinite(from) ? "any date in the past"
	                : dates.buildVeryRelativeDateString(from);
	        var toString = !isFinite(to) ? "any date in the future"
	                : dates.buildVeryRelativeDateString(to);

	        $("#cccalendarfeed_settings_daterangeslider_label .from", root).text(
	            fromString
	        );
	        $("#cccalendarfeed_settings_daterangeslider_label .to", root).text(
	            toString
	        );
	    };

	    runCalendarDataLoadTimeout = function() {
		    calendarDataFileIsNotLoading = false;
	        setTimeout(function() {
	            // If file has not loaded by now, show error message.
			   if (_totalFeedEvents === null) {
	               calendarDataFileIsNotLoading = true;
	               getState(onStateAvailable);
	           }

	           updateCalendar();
	        }, 3000);
	    };

		checkNumberOfColumns = function() {
	        _isInThreeColumnView = (mainContainer.width() < 250);
		}

	   /**
	     * Initialization function DOCUMENTATION
	     */
	    doInit = function () {

            _isInThreeColumnView = false;
            calendarDataHasBeenLoaded = false;
            if (showSettings) {
                // Setup validation/save handler on save button
                var validateOpts = {
                    submitHandler : settingsSave,
					methods: {
	                   "checkICS" : {
	                        'method' : function(value, element) {
	                            var icsPattern = /\.ics$/i;
	                            return value.match(icsPattern);
	                        },
	                        'text' : "File extension must be \".ics\"."
	                    },
                        "checkJsonSuffix" : {
                            'method' : function(value, element) {
                                var basicSuffixPattern = /\/basic$/i;
                                var altJsonSuffixPattern = /\/full\?alt=json$/i;
                                return (value.match(basicSuffixPattern) || value.match(altJsonSuffixPattern));
                                },
                            'text' : "Path must end with either \"/basic\" or \"/full/?alt=json\"."
                        }
                    }
                };

	            sakai.api.Util.Forms.validate(settingsForm, validateOpts, true);

	            $("#cccalendarfeed_settings_save", root).click(function () {
	                settingsForm.submit();
	            });
	            // Hook up the cancel button
	            $("#cccalendarfeed_settings_cancel", root).click(function () {
	                sakai.api.Widgets.Container.informCancel(tuid, "cccalendarfeed");
	            });

	            // Async fetch widget settings to populate form
	            getState(onWidgetSettingsStateAvailable);
            
	            // show the Settings view
	            settingsContainer.show();
	        } else {
	            // set up Main view

	            // Async fetch widget settings to populate form
	            getState(onStateAvailable);

	            // If in three-column layout, change table a bit.
	            checkNumberOfColumns();

	            mainContainer.show();
	            showLoadingIndicator();

	 			// Start timer, to trap for invalid path resulting in ics file being unable to load.
	            runCalendarDataLoadTimeout();

	        }
	    };

	    // run the initialization function when the widget object loads
	    doInit();
	};

    sakai.api.Widgets.widgetLoader.informOnLoad("cccalendarfeed");    
});