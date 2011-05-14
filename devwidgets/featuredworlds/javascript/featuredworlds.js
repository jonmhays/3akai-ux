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
require(["jquery", "sakai/sakai.api.core"], function($, sakai){

    /**
     * @name sakai_global.featuredworlds
     *
     * @class featuredworlds
     *
     * @version 0.0.1
     * @param {String} tuid Unique id of the widget
     * @param {Boolean} showSettings Show the settings of the widget or not
     */
    sakai_global.featuredworlds = function(tuid, showSettings, pageData){

        var $rootel = $("#"+tuid);

        // Containers
        var $featuredworldsContainer = $("#featuredworlds_container", $rootel);
        var featuredworldsWorldsContentContainer = "#featuredworlds_worlds_content_container";

        // Templates
        var featuredworldsTemplate = "featuredworlds_template";
        var featuredworldsWorldsContentTemplate = "featuredworlds_worlds_content_template";

        var tabs = [];
        var world = "";

        var renderWorld = function(success, data){
            $(featuredworldsWorldsContentContainer, $rootel).html(sakai.api.Util.TemplateRenderer(featuredworldsWorldsContentTemplate, {
                "data": data,
                "world": world
            }));
        };

        var fetchWorldData = function(worldId, worldTitle){
            world = worldTitle;
            sakai.api.Server.loadJSON("/var/search/groups.infinity.json", renderWorld, {
                page: 0,
                items: 3,
                q: pageData.category,
                category: worldId,
            });
        };

        var renderWorldTabs = function(data){
            $featuredworldsContainer.html(sakai.api.Util.TemplateRenderer(featuredworldsTemplate, {
                "tabs": tabs,
            }));
            fetchWorldData(tabs[0].id, tabs[0].title);
        };

        var constructWorlds = function(){
            $.each(sakai.config.worldTemplates, function(index, item){
                tabs.push({
                    id: item.id,
                    title: sakai.api.i18n.General.getValueForKey(item.title)
                })
            });
            renderWorldTabs();
        };

        var addBinding = function(){
            $(".featuredworlds_tab").live("click", function(){
                if(!$(this).hasClass("featuredworlds_tab_selected")){
                    var worldId = $(this).attr("sakai-worldid");
                    fetchWorldData(worldId, $(this).text());
                    $(".featuredworlds_tab_selected").removeClass("featuredworlds_tab_selected");
                    $(this).addClass("featuredworlds_tab_selected");
                }
            })
        };

        var doInit = function(){
            addBinding();
            constructWorlds();
        };

        doInit();

    };

    sakai.api.Widgets.widgetLoader.informOnLoad("featuredworlds");
});