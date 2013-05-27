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

/* Services */

angular.module('WebRTCSharedScopeService',[]).
factory('sharedScope',function(){
	
	
	var sharedScope= {};
	sharedScope.medias=new Array();
	sharedScope.connection={};
	sharedScope.friendlist=new Array();
	sharedScope.chats= new Array();
	sharedScope.createChat=function(uri){
		
		
	};
	return sharedScope;
});


angular.module('WebRTC-ClientServices', ['ngResource']).
    factory('Chatmessage', function($resource){
  return $resource('messages/chatmessages.json', {}, {
    query: {method:'GET', params:{}, isArray:true},

  });
});
angular.module('WebRTC-ClientLoginServices', ['ngResource']).
factory('Login', function($resource){
	  return $resource('messages/login.json', {}, {
	    query: {method:'GET', params:{}, isArray:false}
	  });
	});

angular.module('WebRTCMesssageService',[]).
factory('Message',function(){
	
	
	function Message(self, partner) {	
		this.from= self;
		this.to= partner;
		this.time=new Date();
		this.text="";
		this.type= 'im';
		this.cmd= null;
		this.pref= null;
		this.id= null;
		that=this;
		
		return Message;
	}
});

angular.module('WebRTCMediaService',[]).
	factory('Media',function($rootScope){
		
		
		function Media() {
			
			this.type="AV";
			this.stream=null;
			this.src='';
			this.isLocal=true;
			var that =this;
						
			this.setSrc=function(){
				if(that.type=="AV" && that.src==''){
					that.src=webkitURL.createObjectURL(that.stream);
					$rootScope.$apply();
				}
			};
			
			this.setStream= function  (setStream) {
				that.stream= setStream;
				that.setSrc();
			};
			this.setStreamByEvent=function(streamEvent){
				that.setStream(streamEvent.stream);
			};
			
			this.getType =function(){
				switch (that.type) {
				case "AV":
					return {audio:true, video:true};
					break;
				case "A":
					return {audio:true, video:false};
					break;

				default:
					throw "Wrong Media.type";
					break;
				}
			};
		};
		
		return Media;
	});


angular.module('WebRTCCallService',[]).
factory('Call',function(){
	
	
	function Call(userAgent) {
		
		this.IDLE="idle";
		this.WAITING="waiting";
		this.INVITING="inviting";
		this.RINGBACK="ringback";
		this.ACCEPTED="accepted";
		this.ACTIVE="active";
		this.INCOMING="incoming";
		this.ACCEPTING="accepting";
		this.FAILED="failed";
		this.CLOSED="closed";
		 // possible state values:
	    //     idle - not in a call (may not have socket)
	    // outbound call:
	    //     waiting - want to initiate a call, and waiting for socket connection
	    //     inviting - sending outbound INVITE, may be waiting for media
	    //     ringback - received 18x response for outbound INVITE
	    //     accepted - received 2xx response for outbound INVITE
	    //     active - sent ACK for outbound INVITE
	    // incoming call:
	    //     incoming - received incoming INVITE
	    //     accepting - accepted an incoming INVITE, waiting for media
	    // failure, termination
	    //     failed - outbound/inbound call failed due to some reason
	    //     closed - call is closed by remote party
		
		this.status=this.IDLE;
		this.ua=userAgent;
		this.partner="";
		
		this.start= function(){
			
		};
		
		this.end= function(){
			
		};
		this.hold= function(){
			
		};
		
	};
	
	
	
	return Call;
});

angular.module('WebRTCChatService',['WebRTCSharedScopeService']).
factory('Chat',function($rootScope,sharedScope){
	
	
	function Chat(partner) {
		this.partner="";
		
	};
	
	return Chat;
});


angular.module('WebRTCConnectionService',['WebRTCSharedScopeService']).
factory('Connection',function($rootScope,sharedScope){
	
	
	function Connection() {

			this.connected = false;
			this.disconnecting = false;
			this.user="3";
			this.password = "4";
			this.domain ="192.168.1.100";
			this.cometd = $.cometd;
			var that =this;
			
			this._uri = function() {
				return "sip:"+that.user+"@"+that.domain;
			};
			
			this.initialize= function() {
				that.cometd.configure({
					url: "http://localhost:8080/webrtcSigServer/" + 'cometd'
				});
				that.cometd.addListener('/meta/handshake', that.metaHandshake);
				that.cometd.addListener('/meta/connect', that.metaConnect);
				that.cometd.addListener('/meta/subscribe', that.metaSubscribe);
				that.cometd.addListener('/service/auth', that.serviceAuth);
			};
			
			this.connect = function() {
				that.cometd.handshake();
			};
			
			this.doLogin =function ()
			{
				log('*** Performing Login!');
				that.cometd.publish('/service/auth', {
			        uri: that._uri(),
			        password: that.password,
			    });
			};
			
			
			this.metaHandshake=function (message)
			{
				log('*** metaHandshake Listener says: ' + message);
			};
			
			this.metaConnect= function (message) {
				if (message.successful && !that.connected && !that.disconnecting) {
					log('*** metaConnect Listener says: ' + message.successful);
					that.doLogin();
					that.connected = true;
				}
				if (that.disconnecting)
					that.disconnecting = false;
			};
			
			this.metaSubscribe=function (message) {};
			
			this.serviceAuth= function (message)
			{

				log('*** serviceAuth Listener says: ' + message.data.res);
				var result = message.data.res;
				if (result == '200') {
					log('*** Authenticated! Subscribing to /online/ ... ');
					that.cometd.subscribe('/online', that.broadcastOnline);
					that.cometd.subscribe('/user/' + that._uri(), that.broadcastUser);
				}
				else if (result == '100') {}
				else {
					that.cometd.disconnect();
					that.connected = false;
				}
				//reflectLoginResult(result);
			};
			
			this.broadcastOnline=function (message)
			{
				log('*** broadcastOnline listener triggered!');

				var	friendlist=message.data.online;
				
				for ( var i = 0; i <friendlist.length ; i++) {
					if(friendlist[i]==that._uri()){
						friendlist.splice(i,1);
					}
				};
				sharedScope.friendlist=friendlist;
				$rootScope.$apply();
			
				//				var csList = '';
//				var stringArray = message.data.online;
//				stringArray.forEach(function(item) { 		
//					if (csList == '')
//						csList = '' + item;
//					else
//						csList = csList + ', ' + item;
//				});
//				log('*** Online users: ' + csList);
				//refreshFriendList (stringArray);
			};

			this.broadcastUser=function (message){
				if (message.data.from == that._uri())
					return;
				var type = message.data.type;
				if (type == 'im') {
					log('[' + message.data.from + '] ' + message.data.text);
					incomingUserMsg (message.data.text, message.data.from);
				}
				else if (type == 'roap')
				{
					var otherParty = message.data.from;
					var cmd = message.data.cmd;
					var signal = message.data.text;
					var pref = message.data.pref;
					processCall(otherParty, cmd, signal, pref);
					log('*** Receiving ROAP: ' + signal);
				}
			};
		}
		return Connection;
	});


angular.module('WebRTCSipConnectionService',['WebRTCSharedScopeService','WebRTCWebSocketService']).
factory('SipConnection',function($rootScope,sharedScope,WebSocketService){
	
	
	function SipConnection() {
		

	    
		
		var that =this;
		
		
			this.connected = false;
			this.registered=false;
			this.disconnecting = false;
			this.user="3";
			this.password = "4";
			this.domain ="192.168.3.2";
			this.displayname = 'Nummer Drei';
			this.transport ="ws";
			this.listen_ip = 'r' + Math.floor(Math.random() * 10000000000) + ".invalid";
		    this._listen_port = 0;
		    this.stack=null;
		    
		    
		    this.outbound_proxy_address ='192.168.133.128:10080';
		    this.websocket_path = "/sip";
		    this.socket = new WebSocketService(this.outbound_proxy_address,this.websocket_path);
		    
		    
		    // properties in config
		    
		    this.username = 'myname';
		   // this.domain = 'localhost';
		    this.authname =  'myname';
	
		    
		    // properties in register
		    this.outbound = 'proxy';
		 
		    this.register_interval = 180;
		    this.rport = true;
		    this.sipoutbound = false;
		    this.local_aor = function() {
				return '"' + that.displayname + '" <sip:' + that.user + '@' + that.domain + '>';
			};
		    this.sock_state = "idle";
		    this.register_state = "not registered";
		    this.register_button = 'Register';

		    // properties in call
		    this.call_state = "idle";
		    // possible state values:
		    //     idle - not in a call (may not have socket)
		    // outbound call:
		    //     waiting - want to initiate a call, and waiting for socket connection
		    //     inviting - sending outbound INVITE, may be waiting for media
		    //     ringback - received 18x response for outbound INVITE
		    //     accepted - received 2xx response for outbound INVITE
		    //     active - sent ACK for outbound INVITE
		    // incoming call:
		    //     incoming - received incoming INVITE
		    //     accepting - accepted an incoming INVITE, waiting for media
		    // failure, termination
		    //     failed - outbound/inbound call failed due to some reason
		    //     closed - call is closed by remote party

		    this.target_scheme = "sip";
		    this.target_value = "yourname@localhost";
		    this.target_aor = this.target_scheme + ":" + this.target_value;
		    this.has_audio = true;
		    this.has_tones = false;
		    this.has_video = true;
		    this.has_text = false;
		    this.has_location = false;
		    this.location = null;
		    
		    // properties in network
		    this.network_status = null;
		    
		    //properties in program log
		    this.log_scroll = true;
		    
		    // private attributes
		    this._handlers = {};
		    this.network_type = "WebRTC";
		    this.listen_ip = null;
		    this._listen_port = null;
		    this._next_message = null;
		    
		    // SIP headers
		    this.user_agent = "sip-js/1.0";
		    this.server = this.user_agent;
		    
		    // media context
		    this._local_sdp = null;
		    this._remote_sdp = null;
		    this._rtp = []; // RealTimeSocket instances
		    this._gw = null;
		    
		    // HTML5
		    this.has_html5_websocket = false;
		    this.has_html5_video = false;
		    this.has_html5_webrtc = false;
		   
		    this._webrtc_local_stream = null;
		    this._webrtc_peer_connection = null;
		    this.enable_sound_alert = false;
		    this.webrtc_stun = "";
		    
		    // SIP requirements for websocket
		    this._instance_id = "";
		    this._gruu = "";
		    
			
			this._uri = function() {
				return "sip:"+that.user+"@"+that.domain;
			};
			
			this.initialize= function() {
				 var transport = new sip.TransportInfo(that.listen_ip, that._listen_port, that.transport, that.transport == "tls", that.transport != "udp", that.transport != "udp");
				 that.stack= new sip.Stack(that,transport);

			};
			this.reset=function(){
				 that.register_state="not registered";
				 that._reg=null;
			};
			
			this.connect = function() {
				that.register();
			};
			
			this.receivedResponse= function(ua, response, stack) {
			    var method = ua.request.method;
			    log("received Response: " +method);
			    if (method == 'REGISTER') {
			    	that.receivedRegisterResponse(ua, response);
			    }
			    else if (method == "INVITE") {
			    	that.receivedInviteResponse(ua, response);
			    }
			    else if (method == "BYE") {
			    	that.receivedByeResponse(ua, response);
			    }
			    else if (method == "MESSAGE") {
			    	that.receivedMessageResponse(ua, response);
			    }
			    else {
			        log("ignoring response for method=" + method);
			    }
			    $rootScope.$apply();
			};
	
			this.receivedRequest= function(ua, request, stack) {
			    var method = request.method;
			    log("received Request:  " + request.method);
			    switch (method) {
					case "INVITE":{
				        that.receivedInvite(ua, request);
				        break;
				    }
					case "BYE": {
				        that.receivedBye(ua, request);
				        break;
				    }
					case "MESSAGE": {
				    	that.receivedMessage(ua, request);
				    	break;
				    }
					case "ACK": {
				    	that.receivedAck(ua, request);
				    	break;
					}					
					default:
					{
						log("ignoring received request method=" + method);
						//if (method != 'ACK') 
			            ua.sendResponse(ua.createResponse(501, "Not Implemented"));
						break;
					}
				}
			    $rootScope.$apply();
			};
			
			this.receivedMessage= function(ua, request){
				
				 if (request.first("Content-Type").value != "text/plain") {
				        return;
				    }
				 from=request.first("From").value;
				 
				 chat = sharedScope.chats[from.uri];
				 if (!chat){
					try {
						 // TODO: create new chat 
					} catch (e) {
					ua.sendResponse(ua.createResponse(501, "Not Implemented"));
					return;
					}
					
					
				 };
				 
				 chat.push(request);
				 ua.sendResponse(ua.createResponse(200, 'OK'));
			};
			
			this.send=  function(data, addr, stack) {
			   //log("=> " + addr[0] + ":" + addr[1] + "\n" + data);
			    that.socket.send(data, addr);
			};
			
			this.createServer=  function(request, uri, stack) {
			    log("Phone.createServer() for method=" + request.method);
			    return (request.method != "CANCEL" ? new sip.UserAgent(that.stack, request) : null);
			};
		
			this.cancelled= function() {

			};
			this.dialogCreated= function() {

			};
			this.authenticate= function(ua, header, stack) {
			    log("phone.authenticate() called");
			    header.username = that.user;
			    header.password = that.password;
			    return true;
			};
			
			this.createTimer= function(obj, stack) {
				return new sip.TimerImpl(obj);
			};
			
			this.resolve= function() {

			};
			
			this.receivedAck = function(ua, request) {
			    if (that.network_type == "WebRTC") {
			        if (that._webrtc_peer_connection) {
			            var result = that.webrtcSDP2JSON(request);
			            if (result) {
			                log("webrtc - processSignalingMessage(" + result.replace(/\n/g, '\\n').substr(0, 40) + "...)");
			                that._webrtc_peer_connection.processSignalingMessage(result);
			            }
			        }
			    }
			};
			
			this.createRegister = function() {
			    var m = that._reg.createRequest('REGISTER');
			    var c = new sip.Header(that.stack.uri.toString(), 'Contact');
			    c.value.uri.user = that.username;
			    if (that.transport == "ws" || that.transport == "wss") {
			        that.createInstanceId();
			        c.setItem('reg-id', '1');
			        c.setItem('+sip.instance', that._instance_id);
			        m.setItem('Supported', new sip.Header('path, outbound, gruu', 'Supported'));
			    }
			    m.setItem('Contact', c);
			    return m;
			};
			this.createInstanceId = function() {
			    if (!that._instance_id && typeof localStorage != "undefined") {
			        that._instance_id = localStorage.getItem("instance_id");
			        if (!that._instance_id) {
			            that._instance_id = "<urn:uuid:" + that.createUUID4() + ">";
			            localStorage.setItem("instance_id", that._instance_id);
			        }
			    }
			};
			
			this.receivedRegisterResponse = function(ua, response) {
				
			    if (response.isfinal()) {
			        if (that.register_state == "registering") {
			            if (response.is2xx()) {
			            	that.register_state="registered";
			            }
			            else {
			            	that.register_state="not registered";
			            	that._reg = null;
			            }
			        }
			        else if (this.register_state == "unregistering") {
			            that.register_state="not registered";
			            that._reg = null;
			        }
			    }
			    
			};
			
			this.createUUID4 = function() {
			    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			        var r = Math.random()*16|0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			        return v.toString(16);
			    });
			};
			
			this.sendRegister = function() {
			    if (that._reg == null) {
			    	log("create UserAgent")
			        that._reg = new sip.UserAgent(that.stack);
			        that._reg.remoteParty = new sip.Address(that.local_aor());
			        that._reg.localParty = new sip.Address(that.local_aor());
			        if (that.outbound == "proxy") {
			            var outbound_proxy = that.getRouteHeader();
			            if (that.transport != "udp")
			                outbound_proxy.value.uri.param['transport'] = that.transport;
			            that._reg.routeSet = [outbound_proxy];
//			            For REGISTER should we change uri instead of routeSet?
//			            that._reg.remoteTarget = new sip.URI("sip:" + that.username + "@" + that.outbound_proxy_address);
			        }
			    }   
			    
			    var m = that.createRegister();
			    m.setItem('Expires', new sip.Header("" + that.register_interval, 'Expires'));
			    that._reg.sendRequest(m);
			};
			this.getRouteHeader = function(username) {
			    return new sip.Header("<sip:" + (username ? username + "@" : "") + this.outbound_proxy_address + ";lr>", 'Route');
			};
			
			this.register = function() {
			    log("register() " + that.local_aor());
			    if (that.socket.state == "idle") {
			    	that.socket.state ="creating";
			      //  that.register_state= "waiting";
					    
			        that.socket.createSocket();
			    }
			    else if (that.socket.state == "bound" || that.socket.state == "connected") {
			        if (that._reg && that.register_state != "not registered") {
			        	 that.register_state= "unregistering";
			        
			            that.sendUnregister();
			        }
			        else if (that.register_state == "not registered") {
			        	that.register_state= "registering";
			        
			            that.sendRegister();
			        }
			        else {
			            log("ignoring register in state " + that.register_state + " " + that._reg);
			        }
			    }
			};
			

			
			this.webrtcSDP2JSON = function(message) {
			    try {
			        log("webrtc - SIP/SDP to JSON");
			        var contentType = message.hasItem('Content-Type') ? message.first('Content-Type').value : null;
			        var body = message.body;
			        if (contentType == "application/x-webrtc") {
			            body = sip.b64_decode(body);
			            log("webrtc - found " + body);
			            return body;
			        }
			        else if (contentType == "application/sdp" || contentType == null) {
			            if (message.hasItem('X-Webrtc')) {
			                var obj = JSON.parse(sip.b64_decode(message.first('X-Webrtc').value));
			                if (contentType == "application/sdp" && body) {
			                    obj.sdp = body; // body.replace(/\r\n/g, '\r\n')
			                }
			                var result = "SDP\n" + JSON.stringify(obj, null, "   ") + "\n";
			                //var result = 'SDP\n{\n   "messageType" : "' + obj.messageType + '",\n   "offererSessionId" : "' + obj.offererSessionId
			                //    + '",\n   "sdp" : "' + obj.sdp.replace(/\r\n/g, '\\r\\n') + '",\n   "seq" : ' + obj.seq + ',\n   "tieBreaker" : ' + obj.tieBreaker + '\n}\n';
			                log("webrtc - parsed to " + result.replace(/\n/g, '\\n').substr(0, 4) + "... hash=" + sip.MD5(result));
			                return result;
			            }
			            else {
			                return null;
			            }
			        }
			    }
			    catch (error) {
			        log("webrtc - extracting from message failed: " + error);
			    }
			    return null;
			};
			
			
			this.received =function(event){
			log("<= " + event.srcAddress + ":" + event.srcPort + "\n" + event.data);
			that.stack.received(event.data, [event.srcAddress, event.srcPort]);
			};
			

		}
		
		return SipConnection;
	});


angular.module('WebRTCWebSocketService',['WebRTCSharedScopeService']).
factory('WebSocketService',function($rootScope,sharedScope){
	
	
	function WebSocketService(out_proxy_addr, ws_path) {
		this.socket=null;
		this.state="idle";
		this.websocket_path=ws_path;
		this.outbound_proxy_address=out_proxy_addr;
		var that = this;
		
		
		
		this.send = function(data, addr) {
		    log("=> " + addr[0] + ":" + addr[1] + "\n" + data);
		    this.socket.send(data, addr[0], addr[1]);
		};
		
		this.hungup= function() {
			// end all Calls and remove all Media
		};
		
		this.onSockData = function(event) {
			sharedScope.connection.received(event); //use Callback function???
		};
		this.onSockError = function(event) {
		    that.socket = null;
		    that.state="idle";
		    sharedScope.connection.reset(); //use Callback function or Get SIPConnection-Object???
		  //  that.setProperty("call_state", "idle");
		    that.hungup();
		    $rootScope.$apply();
		};
		this.onSockOpen= function() {
			that.state="connected";
		    $rootScope.$apply();
			
		};
		this.onSockClose=function(){
			that.state="idle";
			
			/*also change register- and callstate*/
			
		    $rootScope.$apply();
		};
		
		
		this.createSocket = function() {
		    log("createSocket() transport=" + that.transport);
		    if (true||that.transport == "ws") {
		        log("  connecting to " + that.outbound_proxy_address);
		        try {
		        	that.socket = new WebSocket('ws://' + that.outbound_proxy_address + that.websocket_path, ["sip"]);
		            
		            that.socket.onopen = function() { that.onSockOpen(); };
		            that.socket.onclose = function() {that.onSockClose();};
		            that.socket.onerror = function(error) { that.onSockError({"code": "websocket-error", "reason": error}); };
		            that.socket.onmessage = function(msg) { that.onSockData({"data": msg.data, "srcPort": 0, "srcAddress": "127.0.0.1"}); /* src überprüfen*/};
		        } catch (error) {
		            log("error in websocket: " + error, "error");
		        }
		    }
		    else {
		        log(that.transport + " transport is not yet implemented", "error");
		        that.state="idle";
//		        that.setProperty("sock_state", "idle");
//		        if (that.register_state == "waiting") {
//		            that.setProperty("register_state", "not registered");
//		            that.setProperty("register_button", "Register");
//		            that.setProperty("register_button.disabled", false);
//		        }
//		        if (that.call_state == "waiting") {
//		            that.setProperty("call_state", "idle");
//		            that.setProperty("call_button.disabled", false);
//		            that.setProperty("end_button.disabled", true);
//		        }
		    }
		};
		
		
	}

return WebSocketService;
});
