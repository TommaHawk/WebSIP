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
/*global define
 */

define([ 'controllers/controllers', 'services/Call', 'services/sharedScope' ,'services/Contact'], function(
		controllers) {
	'use strict';
	return controllers.controller('Call', [
			'$scope','Call','sharedScope','$rootScope', 'Contact',
			function($scope,Call, sharedScope,$rootScope,Contact) {

				if(!sharedScope.Call){
					sharedScope.Call=Call;
				}
				if(!sharedScope.Contact){
					sharedScope.Contact=Contact;
				}
				
				$rootScope.Tab1="selected";
				$rootScope.Tab2="";
				$rootScope.Tab3="";
				$rootScope.Tab4="";
				
				$scope.sharedScope = sharedScope;

				$scope.answer= function(call) {
					call.answer();
				};
				$scope.end= function(call) {
					call.end();
				};
				$scope.call = function(to) {
					log("call: "+to);
//					$scope.sharedScope.connection.call(to);
					if(to.indexOf("@")==-1){to+="@"+sharedScope.registration.domain;}
					try{
						var call=sharedScope.getCall("sip:"+to,sharedScope.OUTGOING);
						call.start();
					} catch (e) {
						// TODO: handle exception
						sharedScope.error=e; 
						log("error: "+e);
						throw e;
					}
					//$scope.newMessage="";
				
				};
				if(sharedScope.newCallPartner){
					var partner =sharedScope.newCallPartner;
						sharedScope.newCallPartner="";
					$scope.call(partner);
					};
			} ]);
});
