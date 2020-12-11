/*\
title: $:/plugins/OokTech/Bob/ServerRoutes/get-plugins-fetch.js
type: application/javascript
module-type: serverroute

GET /^\/api\/plugins\/fetch\/<<author>>/<<plugin>>\/?$/

Fetch a plugin

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.method = "GET";

exports.path = /^\/api\/plugins\/fetch\/(.+)\/?$/;

exports.handler = function(request,response,state) {
  $tw.settings.API = $tw.settings.API || {};
  if($tw.settings.API.pluginLibrary === 'yes') {
    const path = require('path');
    const fs = require('fs');
    const getPlugin = function (request) {
      const urlParts = request.url.split('/')
      if(typeof $tw.settings.pluginsPath === 'string') {
        const basePath = $tw.ServerSide.getBasePath();
        const pluginsPath = path.resolve(basePath, $tw.settings.pluginsPath)
        const pluginPath = path.resolve(pluginsPath, urlParts[urlParts.length-2], urlParts[urlParts.length-1])
        if(fs.statSync(pluginPath).isDirectory()) {
          const pluginFields = $tw.loadPluginFolder(pluginPath)
          return pluginFields
        }
      }
      return false
    }
    const token = $tw.Bob.getCookie(request.headers.cookie, 'token');
    const authorised = $tw.Bob.AccessCheck('', token, 'fetch', 'plugin');
    if(authorised) {
      const plugin = getPlugin(request)
      if(plugin) {
        response.writeHead(200, {"Access-Control-Allow-Origin":"*"})
        response.end(JSON.stringify(plugin))
      } else {
        response.writeHead(403)
        response.end()
      }
    } else {
      response.writeHead(403)
      response.end()
    }
  }
};

}());
