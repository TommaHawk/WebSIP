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

// Generated by CoffeeScript 1.3.3
/*global require
*/
function log(msg) {
	var debug=true;
    if (typeof console != "undefined" && debug)
        console.log(msg);
}
require({
  map: {
    '*': {
      'services/services': '../../scripts/services/services',
      'services/Call': '../../scripts/services/Call',
      'services/Chat': '../../scripts/services/Chat',
      'services/SipConnection': '../../scripts/services/SipConnection',
      'services/Media': '../../scripts/services/Media',
      'services/Registration': '../../scripts/services/Registration',
      'services/WebSocketService': '../../scripts/services/WebSocketService',
      'services/sharedScope': '../../scripts/services/sharedScope',
      'libs/angular': '../../scripts/libs/angular',
      'libs/angularMocks': 'libs/angular-mocks',
      'libs/domReady': '../../scripts/libs/domReady',
      'libs/jasmineHtml': 'libs/jasmine-html'
    }
  },
  shim: {
    '../../scripts/libs/angular': {
      exports: 'angular'
    },
    'libs/angular-mocks': {
      deps: ['libs/angular', 'libs/jasmine-html']
    },
    'libs/jasmine': {
      exports: 'jasmine',
      deps: ['libs/angular']
    },
    'libs/jasmine-html': {
      exports: 'jasmine',
      deps: ['libs/jasmine']
    }
  }
}, ['require', 'libs/jasmineHtml', 'serviceSpecs/ChatSpec', 'serviceSpecs/RegistrationSpec', 'serviceSpecs/CallSpec', 'serviceSpecs/MediaSpec','../../app/scripts/sipjs/sip.js'], function(require, jasmine) {
  'use strict';
  return require(['libs/domReady!'], function(document) {
    var env, htmlReporter;
    env = jasmine.getEnv();
    htmlReporter = new jasmine.HtmlReporter();
    env.addReporter(htmlReporter);
    return env.execute();
  });
});