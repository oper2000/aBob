/**
 * @license
   Licensed Materials - Property of IBM

   (C) Copyright 2015 IBM Corp.

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */


/**
 Everything delegates to ibmmobilefirstplatfromfoundationlogger, but we keep the 
 ibmmobilefirstplatformfoundationanalytics API to make it clear
 to callers the difference in purpose of logger (debug) vs. analytics.
 */

(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        // AMD init. 
       if (require.specified("ibmmobilefirstplatformfoundationlogger")) {
        	define(['ibmmobilefirstplatformfoundationlogger'], factory);
        }
        else { //dependency is not loaded, using empty impl
        	define({}, factory);
        }
    } else {
        // Browser globals init
        if (!root.ibmmobilefirstplatformfoundationlogger) { //dependency not founded, using empty impl
        	root.ibmmobilefirstplatformfoundationanalytics = factory({});
        }
        else {
        	root.ibmmobilefirstplatformfoundationanalytics = factory(root.ibmmobilefirstplatformfoundationlogger);
        }
    }
}(this, function (logger) { //analytics impl

	'use strict';

	var

	//Constants
	_PKG_NAME = 'wl.analytics';
	

	/**
    Turns on the capture of analytics data.
	 */
	var _enable = function () {

		logger.config({analyticsCapture: true});

	};

	/**
		Turns off the capture of analytics data.
	 */
	var _disable = function () {

		logger.config({analyticsCapture: false});
		
	};

	/**
    	Logs a message with contextual data.
	 */
	var _log = function (msg, name) {
		if(typeof name === 'undefined'){
			name = '';
		}
			
		if (typeof msg === 'object') {
			logger._metadata(msg)._ctx({pkg: _PKG_NAME}).analytics(name || '');
		} else {
			logger._ctx({pkg: _PKG_NAME}).analytics(msg, name);
		}
	};
	
	/**
    	Collect custom events data.
	*/
	var _event = function (msg) {
		var name = '';
		if (typeof msg === 'object') {
			for(var key in msg){
				name=key;
			}
		}
		_log(msg,name);
	}
	
	

	/**
		Returns the current state of WL.Analytics
	 */
	var _state = function () {
		var currentLoggerState = logger.status();
		return currentLoggerState.analyticsCapture;		
	};
	
	/**
	 * Specify current application user.  If you want user-based analytics, you must use this method
	 * call.  For example, use it when the user logs in. 
	 *
	 */
	function setUserContext(user) {
		logger._setUserContext(user)
	};

	/**
    	Send any collected analytics data collected to this point to the MobileFirst Platform Server.
	 */
	var _send = function () {
		// returns a promise
		logger.send();
		return logger._sendAnalytics();
	};

	/**
    Get tracking id for sending requests
	 */
	var __getTrackingId = function () {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	};

	//public API
	return {
		enable : _enable,
		disable: _disable,
		state: _state,
		send: _send,
		setUserContext: setUserContext,
		addEvent: _event
	}
}));
