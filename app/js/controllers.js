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

/* Controllers */

function ChatmessageListCtrl($scope, Chatmessage, Login) {
//  $http.get('messages/chatmessages.json').success(function(data) {
//    $scope.chatmessages = data;
//  });
	
  $scope.chatmessages =Chatmessage.query();
  $scope.login = Login.query();
  $scope.partner ="Juergen";
  $scope.sendMessage= function() {
	  $scope.chatmessages.push({
		"from":$scope.login.name, 
		"to": $scope.partner,
		"time":"1400",
		"text":$scope.newMessage
	  } 
	  );
	  $scope.newMessage='';
	  $scope.chatmessages.$save;
  };
//  $http.get('messages/login.json').success(function(data) {
//	    $scope.login = data;
//	  });

}

ChatmessageListCtrl.$inject = ['$scope', 'Chatmessage', 'Login'];

function MediaListCtrl($scope, Media,sharedScope) {
	
	$scope.medias=new Array;
		$scope.sharedScope=sharedScope;
		$scope.sharedScope.medias.push(new Media());
		$scope.sharedScope.medias.push(new Media());

	for ( var i=0; i<$scope.sharedScope.medias.length;i++) {
		navigator.webkitGetUserMedia($scope.sharedScope.medias[i].getType(), $scope.sharedScope.medias[i].setStream);
	}

	
};

MediaListCtrl.$inject = ['$scope', 'Media','sharedScope'];

function ConnectionListCtrl($scope, Connection,sharedScope) {
	$scope.sharedScope=sharedScope;
	$scope.sharedScope.connection=new Connection();
	$scope.sharedScope.connection.initialize();
	$scope.sharedScope.connection.connect();
};

ConnectionListCtrl.$inject = ['$scope', 'Connection','sharedScope'];

function SipConnectionListCtrl($scope, SipConnection,sharedScope) {
	$scope.sharedScope=sharedScope;
	$scope.sharedScope.connection=new SipConnection();
	$scope.sharedScope.connection.initialize();
	$scope.sharedScope.connection.connect();
	
	$scope.register=function(){
		console.log("test");
		$scope.sharedScope.connection.register();
	};

	
};

SipConnectionListCtrl.$inject = ['$scope', 'SipConnection','sharedScope'];


function LoginCtrl($scope, $http) {
	
	$scope.checkLogin = function(imageUrl) {
	    
		
	  };

	}
