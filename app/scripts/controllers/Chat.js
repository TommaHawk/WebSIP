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

define([ 'controllers/controllers', 'services/Chat', 'services/sharedScope' ,'services/Contact'], function(
		controllers) {
	'use strict';
	return controllers.controller('Chat', [
			'$scope','Chat','sharedScope','$rootScope', 'Contact',
			function($scope,Chat, sharedScope,$rootScope,Contact) {
				$rootScope.Tab1="";
				$rootScope.Tab2="selected";
				$rootScope.Tab3="";
				$rootScope.Tab4="";
				
				sharedScope.Chat=Chat;
				if(!sharedScope.Contact){
					sharedScope.Contact=Contact;
				}
				$scope.sharedScope = sharedScope;
				$scope.sharedScope.newChatPartner="2060";
				$scope.sendMessage = function(to, newMessage) {
					
					
					if(!newMessage) return;
					log("sendMessage: "+newMessage +" to: "+to);
					if(to.indexOf("@")==-1){to+="@"+sharedScope.registration.domain;}
					
					
					var chat=null;
					
					try {
							 chat = $scope.sharedScope.createChat(new sip.Address(to).toString());
						} catch (e) {
							log("error:"+ e);
							$scope.sharedScope.error=e;
							throw e;
							return;
						};
					
						chat.sendMessage(newMessage,to);
					
				};
				$scope.getSide = function(message, chat) {
					return (message.uri.toString()==chat.partner)?"left":"right";
				};
				$scope.getFullNewPartner = function() {
					return'sip:'+$scope.newChatPartner;
				};
				$scope.sendPendingMessages= function() {
					log("sendPending");
					for ( var i in sharedScope.chats) {
						var chat=sharedScope.chats[i];
						chat.sendPendingMessages();
					}
				};

			} ]);
});
