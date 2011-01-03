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
/* global $, Config, jQuery, sakai, sdata */

var sakai = sakai || {};
sakai.myb = sakai.myb || {};

sakai.myb.noticewidgets = {};

sakai.myb.noticewidgets.getNotices = function(dataURL, formatter) {

    $.ajax({
        url: dataURL,
        cache: false,
        success: function(data) {
            if (data.results) {
                sakai.myb.noticewidgets.formatNotices(data);
                formatter(data);
            }
        },
        error: function(xhr, textStatus, thrownError) {
            alert("Getting notices failed for:\n" + url + "\ncategory=reminders and taskstate=" + taskState + " with status=" + textStatus +
                    " and thrownError=" + thrownError + "\n" + xhr.responseText);
        }
    })
};

sakai.myb.noticewidgets.formatNotices = function(data) {
    console.dir(data);

};

/**
 * Formats a date to something like Mon 1/1/10
 * @param {Object} date UTF string
 */
sakai.myb.noticewidgets.formatDateAsString = function(date) {
    if (!date) return null;
    var days_short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    date = sakai.api.Util.parseSakaiDate(date);
    var year = "" + date.getFullYear();
    return days_short[date.getDay()] + " " + (date.getMonth() + 1) + "/" + date.getDate() + "/" + year.substring(2, 4);
};

/*
 * Initialize the My Tasks widget
 * @param {String} tuid unique id of the widget
 * @param {Boolean} showSettings show the settings of the widget or not
 */
sakai.mytasks = function(tuid, showSettings) {

    var $rootel = $("#" + tuid);
    var $tasksList = $(".tasks_list", $rootel);
    var template = "mytasks_template";
    var dataURL = sakai.config.URL.MYREMINDERS_TASKSTATE_SERVICE + "?taskState=created";
    var formatTasks = function(data) {
        $tasksList.html($.TemplateRenderer(template, data));
    };

    var doInit = function() {
        sakai.myb.noticewidgets.getNotices(dataURL, formatTasks);
    };

    doInit();
};

sakai.myevents = function(tuid, showSettings) {

    var doInit = function() {

    };

    doInit();
};

sakai.api.Widgets.widgetLoader.informOnLoad("mytasks");
sakai.api.Widgets.widgetLoader.informOnLoad("myevents");