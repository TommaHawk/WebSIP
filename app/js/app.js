/*
*Copyright (c) 2013 Thomas Falkenberg.
*All rights reserved. This program and the accompanying materials
*are made available under the terms of the GNU Public License v3.0
*which accompanies this distribution, and is available at
*http://www.gnu.org/licenses/gpl.html
*
*Contributors:
*    Thomas Falkenberg - initial API and implementation
*    Deutsche Telekom AG- Telekom Laboratories Darmstadt
*/

'use strict';

function log(msg) {
	var debug=true;
    if (typeof console != "undefined" && debug)
        console.log(msg);
}
	
/* App Module */
angular.module('WebRTC-Client', ['WebRTC-ClientServices','WebRTC-ClientLoginServices','WebRTCConnectionService','WebRTCMediaService','WebRTCSharedScopeService','WebRTCSipConnectionService']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/chats', {templateUrl: 'partials/chatmessage-list.html',   controller: ChatmessageListCtrl}).
      when('/login', {templateUrl: 'partials/login.html',   controller: LoginCtrl}).
      when('/media', {templateUrl: 'partials/media-list.html',   controller: MediaListCtrl}).
      when('/connection', {templateUrl: 'partials/connection-list.html'  }).
      otherwise({redirectTo: '/chats'});
}]);
