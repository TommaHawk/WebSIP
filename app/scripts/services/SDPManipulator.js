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

define(['services/services','services/sharedScope'], function(services) {
  'use strict';
  return services.factory('SDPManipulator', [
    	'$rootScope','sharedScope',function($rootScope,sharedScope){
    		
    		function SDPManipulator(sdp) {
    			var that=this;
    			that.sdp=sdp;
    			this.doRFC5939 =function(){
    				
    				 if (navigator.mozGetUserMedia) {
    					 //TODO
				 }
				 else if (navigator.webkitGetUserMedia) {
					 that.sdp =that.sdp.replace(/acap:.*crypto/g ,"crypto" );
					 that.sdp =that.sdp.replace(/RTP\/AVP /g ,"RTP/AVPF " );
				 return that.sdp;
				 } else {
					 
					 throw new Error("No WebRTC supported");
				 }
    			}
    			
    		}    		
    		
    		
    		return SDPManipulator;
    	}
  ]);
});
