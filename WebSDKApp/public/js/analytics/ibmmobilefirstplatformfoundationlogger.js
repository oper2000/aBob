/*
 Licensed Materials - Property of IBM

 (C) Copyright 2015 IBM Corp.

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
/*globals WL, printStackTrace, air, worklight, cordova, WLJQ*/
/*jshint expr:true, strict:false, maxdepth:4, maxparams:5*/

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD init. No dependencies
        define(factory);
    } else {
        // Browser globals init
        root.ibmmobilefirstplatformfoundationlogger = factory();
        
    }
}(this, function () { //logger impl

        REQ_SEND_LOGS = '/mfp/api/loguploader',
        REQ_UPDATE_CONFIG = '/mfp/api/clientLogProfile',
        KEY_LOCAL_STORAGE_LOGS = '__WL_WEBLOG_LOGS__',
        KEY_LOCAL_STORAGE_SWAP = '__WL_WEBLOG_SWAP__',
        KEY_LOCAL_STORAGE_ANALYTICS = '__WL_WEBLOG_ANALYTICS__',
        KEY_LOCAL_STORAGE_CONFIG = '__WL_WEBLOG_CONFIG__',
        KEY_REMOTE_STORAGE_CONFIG = '__WL_WEBLOG_REMOTE_CONFIG__',

        DEFAULT_MAX_STORAGE_SIZE = 500000,
        BUFFER_TIME_IN_MILLISECONDS = 60000,
        sendLogsTimeBuffer = 0;
        var LEFT_BRACKET = '[';
    	var RIGHT_BRACKET = '] '; //There's a space at the end.
    
    	var metadataHeader = {};
        var startupTime = 0;
        var appSessionID = '';
        var state = __getStateDefaults();
        
        	// Private variables
		var pendingTrackingIDs = {};


        if (!window.console) {  // thanks a lot, IE9
          /*jshint -W020 */
          console = {
            error: function() {},
            warn: function() {},
            info: function() {},
            log: function() {},
            debug: function() {},
            trace: function() {}
          };
        }

        console.log = console.log || function() {};  // I suppose console.log is the most likely to exist.
        console.warn = console.warn || console.log;
        console.error = console.error || console.log;
        console.info = console.info || console.log;
        console.debug = console.debug || console.info;
        console.trace = console.trace || console.debug;  // try to keep the verbosity down a bit

    var priorities = {
        trace      : 600,
        debug      : 500,
        log        : 400,
        info       : 300,
        warn       : 200,
        error      : 100,
        fatal      : 50,
        analytics : 25
    };

	var __usingLocalConfiguration = function(){
		var configurationString = localStorage.getItem(KEY_REMOTE_STORAGE_CONFIG);

		if(configurationString == null){
			return true;
		}

		return false;
	};

	/*
	*	INIT - Load state if persisted. Else get default state
	*/
	(function(){
		try {
			if (typeof(Storage) !== 'undefined') {

				var configurationString = null;

				if(__usingLocalConfiguration()){
					configurationString = localStorage.getItem(KEY_LOCAL_STORAGE_CONFIG);
				}else{
					configurationString = localStorage.getItem(KEY_REMOTE_STORAGE_CONFIG);
				}

				if (configurationString === null){
				  var state = __state();
				  state.maxFileSize = DEFAULT_MAX_STORAGE_SIZE;
				  __updateState(state);

				  var stateString = JSON.stringify(state);
				  localStorage.setItem(KEY_LOCAL_STORAGE_CONFIG, stateString);
				} else {
				  var configuration = JSON.parse(configurationString);
				  __updateState(configuration);
				}
				_init();
			}
		} catch ( err ) {
			console.err(err.message);
		}
	})();
	function initXHR(XHR, analytics) {
		"use strict";

		var open = XHR.prototype.open;
		var send = XHR.prototype.send;


		function _generateUUID() {
			var d = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
			});
			return uuid;
		};

		XHR.prototype.open = function(method, url, async, user, pass) {
			this._url = url;
			open.call(this, method, url, async, user, pass);
		};

		XHR.prototype.send = function(data) {
			var self = this;
			var oldOnReadyStateChange;
			var url = this._url;
			__logOutboundRequest(this);

		        var duration = new Date().getTime() - startupTime;
		        if (appSessionID == "") {
		   		logAnalyticsSessionStart();
		        }
		        else if (duration > 10000) {
		   		logAnalyticsSessionStop();
		        }
		    	startupTime = new Date().getTime();
			this.setRequestHeader("x-wl-analytics-tracking-id", _generateUUID());
			this.setRequestHeader("x-mfp-analytics-metadata", JSON.stringify(metadataHeader));

			function onReadyStateChange() {
				if(self.readyState == 4 /* complete */) {
					/* This is where you can put code that you want to execute post-complete*/
					/* URL is kept in this._url */
					__logInboundResponse(this);
					console.log('Called successfully to server using xhr');
				}

				if(oldOnReadyStateChange) {
					oldOnReadyStateChange();
				}
			}

			/* Set xhr.noIntercept to true to disable the interceptor for a particular call */
			if(!this.noIntercept) {            
				if(this.addEventListener) {
					this.addEventListener("readystatechange", onReadyStateChange, false);
				} else {
					oldOnReadyStateChange = this.onreadystatechange; 
					this.onreadystatechange = onReadyStateChange;
				}
			}

			send.call(this, data);
		}
	} 


	/*
	 * PRIVATE METHODS
	 */

	var __send = function(keys) {

		var data = getLogsData(keys);
		
		if(data == null || data == ''  ){
             console.log('There are no persisted logs to send.');
             return;
        }
                		
		__ajax(data, REQ_SEND_LOGS)
			.then(function (response) {
				emptyLogs(keys);
				__logInboundForSendResponse(response[0]);
				console.log('Client logs successfully sent to the server');
			})
			.catch(function (err) {
			  console.error('call to xhr failed', err.statusText);
		});

	};
	
    function __sendAnalytics() {
        __send([KEY_LOCAL_STORAGE_ANALYTICS]);
    };

    function getLogsData(keys){
        var persistedLogs = '';
        keys.forEach(function(key){
            var value = localStorage.getItem(key);
            if(value !== null){
                persistedLogs += value;
            }
        });
		if (persistedLogs == ''){
            return '';
        }

        var logdata = {
            __logdata : persistedLogs
        };
        return JSON.stringify(logdata);
    };	

    var __ajax = function(data,path,method) {
    	  
    	return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();
			if (method == null){
				method = 'POST'
			}
			xhr.open(method, path,true);
			
			xhr.onload = function () {
			  if (this.status >= 200 && this.status < 300) {
				resolve([xhr.networkMetadata,xhr.response]);				
			  } else {
				reject({
				  status: this.status,
				  statusText: xhr.statusText
				});
			  }
			};
			xhr.onerror = function () {
			  reject({
				status: this.status,
				statusText: xhr.statusText
			  });
			};
			xhr.send(data);
	  	});
    	  
    	  
      };
      
      var __logOutboundRequest = function (request) {
		
			try{
				request.trackingId = __getTrackingId();
				pendingTrackingIDs[request.trackingId] = 1;
				var outboundTimestamp = new Date().getTime();
// 				var url = 'http://localhost:9080/' + request._url;//__getFullURL(global, request._url);TODO
	
				var metadata = {
// 					'$path': url, //$path for legacy reasons
					'$category' : 'network',
					'$trackingid' : request.trackingId,
					'$outboundTimestamp' : outboundTimestamp
				};
				
				var logMetadata = {
					'$class':'wl.analytics.xhrInterceptor',
					'$file':'ibmmobilefirstplatformfoundationlogger.js',
					'$method':'intercept',
// 					'$line":138,
					'$src':'javascript'
				};
				
				request.networkMetadata = metadata;
				
				var logData = {
				 'pkg': 'wl.analytics',
				 'timestamp': __formatDate(new Date(), '%d-%M-%Y %H:%m:%s:%ms'),
				 'level': 'ANALYTICS',
				 'msg': 'InternalRequestSender outbound',
				 'metadata': logMetadata
				};
				
    			__persistLog(logData, KEY_LOCAL_STORAGE_ANALYTICS);
				
			}catch(e){
				// Do nothing
			}
	};
	
		/**
	Log inbound network response
	*/
	var __logInboundResponse = function (request) {
		
			try{
				var trackingId = request.trackingId;
				
				if(pendingTrackingIDs.hasOwnProperty(trackingId)){
					delete pendingTrackingIDs[trackingId];
					
					var inboundTimestamp = new Date().getTime();
					var numBytes = 0;
					var responseText = '';//response.responseJSON;TODO
					
					/*jshint maxdepth:4*/
					if(responseText){
						numBytes = JSON.stringify(responseText).length;
					}
					
					var metadata = request.networkMetadata;
					
					if(metadata !== null){
						var outboundTimestamp = metadata['$outboundTimestamp'];
						var roundTripTime = inboundTimestamp - outboundTimestamp;
							
						metadata['$inboundTimestamp'] = inboundTimestamp;
						metadata['$bytesReceived'] = numBytes;
						metadata['$roundTripTime'] = roundTripTime;
						metadata['$responseCode'] = request.status;
						metadata['$requestMethod'] = 'post';//TODO request.status;
						metadata['$path'] = request.resposeURL;
						
						request.networkMetadata = metadata;

					}
					
					
					var logData = {
					 'pkg': 'wl.analytics',
					 'timestamp': __formatDate(new Date(), '%d-%M-%Y %H:%m:%s:%ms'),
					 'level': 'ANALYTICS',
					 'msg': 'InternalRequestSender logInboundResponse',
					 'metadata': metadata
					};
    			__persistLog(logData, KEY_LOCAL_STORAGE_ANALYTICS);
				}
			}catch(e){
// 				alert(e);
				// Do nothing
			}
	};
	
	
	var __logInboundForSendResponse = function (metadata) {
		
			try{
				
				var logData = {
				 'pkg': 'wl.analytics',
				 'timestamp': __formatDate(new Date(), '%d-%M-%Y %H:%m:%s:%ms'),
				 'level': 'ANALYTICS',
				 'msg': 'InternalRequestSender logInboundResponse',
				 'metadata': metadata
				};
				__persistLog(logData, KEY_LOCAL_STORAGE_ANALYTICS);
				
			}catch(e){
// 				alert(e);
				// Do nothing
			}
	};
	
	
  var __setTrackingId = function (id) {
    pendingTrackingIDs[id] = 1;
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

 	var __getFullURL = function (global, path) {

		if (typeof path === 'string' &&
			path.indexOf('http') === -1 &&
			global &&
			typeof global.location === 'object' &&
			typeof global.location.protocol === 'string' &&
			typeof global.location.hostname === 'string' &&
			typeof global.location.port === 'string' &&
			global.location.protocol.indexOf('file') === -1
		) {
			//Path does not contain 'http',
			//meaning a full url was NOT passed.

			path = [
				global.location.protocol,
				'//',
				global.location.hostname,
				':',
				global.location.port,
				path
			].join('');

			if (path.indexOf('?') !== -1) {
				path = path.split('?')[0];
			}

		}

		return path;
	};

      var __persistLog = function(log, key){
    		if(__fileSizeReached(key)){
    			if(key === KEY_LOCAL_STORAGE_LOGS){
    				__attemptFileSwap();
    			}else{
    				// No swapping for analytics
    				return;
    			}
    		}

    		var stringified = JSON.stringify(log);
    		var persistedLogs = localStorage.getItem(key);

    		if(persistedLogs === null){
    			persistedLogs = stringified;
    		}else{
    			persistedLogs +=  ', ' + stringified;
    		}

    		try{
    			localStorage.setItem(key, persistedLogs);
    		}catch(e){
    			console.log('Local storage capacity reached. Client logs will not be persisted');
    		}
    	};

    	var __attemptFileSwap = function(){
    		try{
    			var currentLogs = localStorage.getItem(KEY_LOCAL_STORAGE_LOGS);
    			localStorage.setItem(KEY_LOCAL_STORAGE_SWAP, currentLogs);
    			localStorage.removeItem(KEY_LOCAL_STORAGE_LOGS);
    		}catch(e){
    			console.log('Local storage capacity reached. WL.Logger will delete old logs to make room for new ones.');
    			localStorage.removeItem(KEY_LOCAL_STORAGE_LOGS);
    			localStorage.removeItem(KEY_LOCAL_STORAGE_SWAP);
    		}
    	};

    	var __processUpdateConfig = function(configString){
    		var config = null;

    		try{
    			config = JSON.parse(configString.responseText);
    		}catch(e){

    		}

    		if(config !== null){
    			console.log('Matching configuration successfully retrieved from the server.');
    			var wllogger = config.wllogger;
    			if(wllogger !== null){
    		    localStorage.setItem(KEY_REMOTE_STORAGE_CONFIG, localStorage.getItem(KEY_LOCAL_STORAGE_CONFIG));
    				_setServerOverrides(wllogger);
    			}
    		}else{
    			console.log('No matching configurations found from the server. Defaulting to local configuration');
    			localStorage.removeItem(KEY_REMOTE_STORAGE_CONFIG);

    			var configurationString = localStorage.getItem(KEY_LOCAL_STORAGE_CONFIG);
    			var configuration = JSON.parse(configurationString);
                __updateState(configuration);
                __unsetServerOverrides();
    		}
    	};

      var __setState = function(state){
    		if (typeof(Storage) !== 'undefined') {
    		      var stateString = JSON.stringify(state);

    		      if(__usingLocalConfiguration()){
    		    	  localStorage.setItem(KEY_LOCAL_STORAGE_CONFIG, stateString);
    		      }else{
    		    	  localStorage.setItem(KEY_REMOTE_STORAGE_CONFIG, stateString);
    		      }
    		}
      };



      /*
    	 * UTILITY METHODS
       */

		var __getHeaders = function(){
			var appName = WL.Client.getAppProperty(WL.AppProp.APP_DISPLAY_NAME);
			var appVersion = WL.Client.getAppProperty(WL.AppProp.APP_VERSION);
			var env = WL.StaticAppProps.ENVIRONMENT;
			var deviceId = 'UNKNOWN';
			var osversion = 'UNKNOWN';
			var model = 'UNKNOWN';

			if(typeof window.cordova === 'object' &&
		  typeof window.device === 'object') {
				osversion = device.version;
				model = device.model;
				deviceId = device.uuid;
			}

			if(env === 'preview'){
				env = 'common';
			}

			var headers = {
		  'x-wl-clientlog-deviceId' : deviceId,
		  'x-wl-clientlog-appname' : appName,
		  'x-wl-clientlog-appversion' : appVersion,
		  'x-wl-clientlog-osversion' : osversion,
		  'x-wl-clientlog-env' : env,
		  'x-wl-clientlog-model' : model
			};

			return headers;
		};

		var __fileSizeReached = function(key){
			var persistedLogs = localStorage.getItem(key);
			if(persistedLogs === null) {
		  return false;
			}

			var m = encodeURIComponent(persistedLogs).match(/%[89ABab]/g);
			var size = persistedLogs.length + (m ? m.length : 0);

			var maxSize = __state().maxFileSize;
			if(maxSize === null || typeof maxSize === 'undefined') {
				maxSize = DEFAULT_MAX_STORAGE_SIZE;
			}

			if(size >= maxSize){
				return true;
			}

			return false;
		};

		var __formatDate = function(date, fmt) {
		function pad(value) {
		  return (value.toString().length < 2) ? '0' + value : value;
		}
		return fmt.replace(/%([a-zA-Z])/g, function (m, fmtCode) {
		  switch (fmtCode) {
			case 'Y':
			return date.getFullYear();
			case 'M':
			return pad(date.getMonth() + 1);
			case 'd':
			return pad(date.getDate());
			case 'H':
			return pad(date.getHours());
			case 'm':
			return pad(date.getMinutes());
			case 's':
			return pad(date.getSeconds());
			case 'ms':
			return pad(date.getMilliseconds());
			default:
			throw new Error('Unsupported format code: ' + fmtCode);
		  }
	   });
	  };


    function __getStateDefaults() {
        var udf;  // because undefined can be overridden
        return {
            enabled : true,
            stringify : true,
            pretty: false,
            stacktrace : false,
            ismsie : !!(document.all && document.querySelector && !document.addEventListener),
            callback : '',
            tag : {level: false, pkg: true},
            pkg : '',
            whitelist : [],  // @deprecated since version 6.2; use filters instead
            blacklist : [],  // @deprecated since version 6.2; use filters instead
            filters : udf,
            filtersFromServer: udf,
            level : 'trace',
            levelFromServer : udf,
            metadata : {},
            capture : udf,
            captureFromServer : udf,
            analyticsCapture : udf,
            maxFileSize : udf
        };
    };

    var __resetState = function () {
        state = __getStateDefaults();
        return this;
    };

    var __getLogArgArray = function (args, priority, pkg) {

        var msgStr = __stringifyArguments(args);
        var caller = getCallerLine();
		var originMeta = {
			'$src': 'js'
		 };
		if(!state.metadata.hasOwnProperty('filename') && caller != ""){
			var parsed = formatStackLine(caller);
			originMeta = {
			 '$class' : 'Object',
			 '$file' : parsed.file,
			 '$method' : parsed.method,
			 '$line' : parsed.linenumber,
			 '$src': 'js'
			};
    	}
        var meta = __extend({},true, state.metadata ,originMeta); //clone obj
        state.metadata = {}; //clear metadata obj

        for (var i = 0; i < args.length; i++) {

            if (args[i] instanceof Error) {
                args[i] = {'$name': args[i].toString(), '$stacktrace': printStackTrace({e: args[i]})};
            }
        }

        if (typeof priority === 'string') {
            priority = priority.toUpperCase();
        }

        return [priority, pkg, msgStr, meta, (new Date()).getTime()];
    };


	function getCallerLine(){
		var stack = new Error().stack;
		var lines = stack.split('\n');
		for(var i = 1; i<lines.length; ++i){
			var line = lines[i];
			if(line.indexOf("ibmmobilefirstplatformfoundationlogger") == -1 && line.indexOf("ibmmobilefirstplatformfoundationanalytics") == -1){
				return line;
			}
		}
		return "";
		
	}
	function formatStackLine(stackLine){
		var formats = [/^\x20+at\x20(?:([^(]+)\x20\()?(.*?)(?::(\d+):(\d+))?\)?$/, /^([^@]*)@(\S*):(\d+)$/];
		var method = "";
		var file = "";
		var linenumber = "";
		var parsed  = null;
		parsed = stackLine.match(formats[0]);
		if( parsed == null){
			parsed = stackLine.match(formats[1]);
		}
		if(parsed != null){
			method = parsed[1];
			file = parsed[2];
			linenumber = parsed[3];
		} 
    	return {
      		method: method,
      		file: file,
      		linenumber: linenumber
    	};
	}

    var __insideArray = function (needle, haystack) {

        return haystack.indexOf(needle) !== -1;
    };

    var __getKeys = function (obj) {
        var arr = [];

        for (var key in obj) {
            if(obj.hasOwnProperty(key)){
                arr.push(key);
            }
        }
        return arr;
    };

    var __setState = function (options) {

        state = {
            enabled : typeof options.enabled === 'boolean' ? options.enabled : state.enabled,
            stringify : typeof options.stringify === 'boolean' ? options.stringify : state.stringify,
            pretty: typeof options.pretty === 'boolean' ? options.pretty : state.pretty,
            stacktrace : typeof options.stacktrace === 'boolean' ? options.stacktrace : state.stacktrace,
            ismsie : typeof options.ismsie === 'boolean' ? options.ismsie : state.ismsie,
            callback : options.callback || state.callback,
            tag : __extend({},{level: false, pkg: true}, options.tag || state.tag),
            pkg : options.pkg || state.pkg,
            whitelist : options.whitelist || state.whitelist,  // @deprecated in 6.2; use filters instead
            blacklist : options.blacklist || state.blacklist,  // @deprecated in 6.2; use filters instead
            filters : options.filters === null || typeof options.filters === 'object' ? options.filters : state.filters,  // {'jsonstore': 'WARN', 'otherPkg': 'DEBUG'}
            filtersFromServer : typeof options.filtersFromServer === 'object' ? options.filtersFromServer : state.filtersFromServer,
            level : options.level || state.level,
            levelFromServer : options.levelFromServer || state.levelFromServer,
            metadata: options.metadata || state.metadata,
            capture : typeof options.capture === 'boolean' ? options.capture : state.capture,
            captureFromServer : typeof options.captureFromServer === 'boolean' ? options.captureFromServer : state.captureFromServer,
            analyticsCapture : typeof options.analyticsCapture === 'boolean' ? options.analyticsCapture : state.analyticsCapture,
            maxFileSize : typeof options.maxFileSize === 'number' && options.maxFileSize % 1 === 0 ? options.maxFileSize : state.maxFileSize
        };

         if (typeof(Storage) !== 'undefined') {
            	var stateString = JSON.stringify(state);

            	if(__usingLocalConfiguration()){
            		  localStorage.setItem(KEY_LOCAL_STORAGE_CONFIG, stateString);
            	}else{
            		  localStorage.setItem(KEY_REMOTE_STORAGE_CONFIG, stateString);
            		  }
          }
    };

    var __stringify = function (input) {

        if (input instanceof Error) {

            return (state.stacktrace) ? printStackTrace({e: input}).join('\n') : input.toString();
        }

        else if (typeof input === 'object' && JSON && JSON.stringify) {

            try {
                return (state.pretty) ? JSON.stringify(input, null, ' ') : JSON.stringify(input);
            }
            catch (e) {
                return 'Stringify Failed: ' + e;
            }

        } else {
            return (typeof input === 'undefined') ? 'undefined' : input.toString();
        }
    };

    var __stringifyArguments = function (args) {

		if (typeof args === 'string' || args instanceof String){
			return args;
		}
        var len = args.length,
            i = 0,
            res = [];

        for (; i < len ; i++) {
            res.push(__stringify(args[i]));
        }

        return res.join(' ');
    };

    //currentPriority is the priority linked to the current log msg
    //stateLevel can be an Array (whitelist of levels), a string (e.g. 'warn') or a number (200)
    var __checkLevel = function (currentPriority, stateLevel) {

        if (Array.isArray(stateLevel)) {

            return  (//Check if current is whitelisted (state)
                stateLevel.length > 0 &&
                !__insideArray(currentPriority, stateLevel)
            );

        } else if (typeof stateLevel === 'string') {

            stateLevel = stateLevel.toLowerCase();//Handle WARN, wArN, etc instead of just warn

            return  (//Get numeric value and compare current with state
                typeof (priorities[currentPriority]) === 'number' &&
                typeof (priorities[stateLevel]) === 'number' &&
                (priorities[currentPriority]  > priorities[stateLevel])
            );

        } else if (typeof stateLevel === 'number') {

            return (//Compare current with state
                typeof (priorities[currentPriority]) === 'number' &&
                (priorities[currentPriority]  > stateLevel)
            );
        }

        return true; //Bail out, level is some unknown type
    };

    var __checkFilters = function (priority, pkg) {
        var currFilters = state.filtersFromServer || state.filters;
        if (__getKeys(currFilters).length > 0) {  // non-empty filters object
            return __checkLevel(priority, currFilters[pkg]);
        }
        return false;
    };

    var __checkLists = function (pkg, whitelistArr, blacklistArr) {

        return (//Package inside Whitelist
            (Array.isArray(whitelistArr) && whitelistArr.length > 0 && !__insideArray(pkg, whitelistArr)) ||

            //Package inside Blacklist
            (Array.isArray(blacklistArr) && blacklistArr.length > 0 && __insideArray(pkg, blacklistArr))
        );
    };

    var __log = function (args, priority) {

        //TODO check if env is IE and then set console.trace = console.debug;
		state = __state();
        var str = '',
            pkg = state.pkg;

        state.pkg = ''; //clear pkg from state obj

        if (!state.enabled ||
            __checkFilters(priority, pkg) ||
            __checkLists(pkg, state.whitelist, state.blacklist) ||
            __checkLevel(priority, state.levelFromServer || state.level)) {

            return;
        }

        if (state.stringify) {
            str = __stringifyArguments(args);
        }

        //Apply Package Tag
        if (state.tag.pkg && typeof pkg === 'string' && pkg.length > 0) {
            str = LEFT_BRACKET + pkg + RIGHT_BRACKET + str;
        }

        //Apply Level Tag
        if (state.tag.level) {
            str = LEFT_BRACKET + priority.toUpperCase() + RIGHT_BRACKET + str;
        }

        if (!state.stringify && str.length > 0) {
            args.unshift(str);
        }

        // Queue for later sending
         var logArgArray = __getLogArgArray(args, priority, pkg)
         var state = __state();

		  //setTimeout(function () {
			  if (typeof(Storage) !== 'undefined') {
					var level =  logArgArray[0];
					var pkg = logArgArray[1];
					var msg = logArgArray[2];
					var meta = logArgArray[3];
					var time = logArgArray[4];

					var logData = {
					  'timestamp': time,
					  'level': level,
					  'pkg': pkg,
					  'msg': msg,
					  'metadata': meta
					};

					if(level === 'ANALYTICS' && state.analyticsCapture !== false){
					  __persistLog(logData, KEY_LOCAL_STORAGE_ANALYTICS);
					}else if(state.capture !== false){
					  __persistLog(logData, KEY_LOCAL_STORAGE_LOGS);
					}
			  }
		  //}, 0, logArgArray);

        //Log to the console
        // we use WL.StaticAppProps instead of WL.Client.getEnvironment because the former is
        // guaranteed to be available
        if (typeof console === 'object') {  // avoid infinite loop on Adobe AIR

            if (typeof console[priority] === 'function') {
                (state.stringify) ? console[priority](str) : console[priority].apply(console, args);

            } else if (priority === 'fatal') {
                if (typeof console.error === 'function') {
                    (state.stringify) ? console.error(str) : console.error.apply(console, args);
                }

            } else if (priority === 'trace') {
                if (typeof console.debug === 'function') {
                    (state.stringify) ? console.debug(str) : console.debug.apply(console, args);
                }

            } else if (priority === 'analytics') {
                // Do nothing
            } else if (typeof console.log === 'function') {
                (state.stringify) ? console.log(str) : console.log.apply(console, args);

            } else if (state.ismsie && typeof console.log === 'object') {
                (state.stringify) ? console.log(str) : console.log.apply(console, args);
            }

        }

        //The default value of state.callback is an empty string (not a function)
        if (typeof state.callback === 'function') {
            if (!state.stringify) {
                str = args;
            }
            state.callback(str, priority, pkg);
        }

    };

    var LogInstance = function (ops) {
        this.options = ops || {};
    };

    //Add .debug(), .log(), etc. to LogInstances
    // $.each(__getKeys(priorities), function (idx, priority) {
	//         LogInstance.prototype[priority] = function () {
	//             _ctx(this.options)[priority].apply(this, arguments);
	//         };
	//     });
    __getKeys(priorities).forEach(function (idx, priority) {
        LogInstance.prototype[priority] = function () {
            _ctx(this.options)[priority].apply(this, arguments);
        };
    });

    var _create = function (options) {
        return new LogInstance(options);
    };

    var _config = function(options) {
        __setState(__extend({},options || {}, {enabled: true}));
        return this;
    };

    var _status = function () {

//         var dfd = $.Deferred();
        // var onSuccess = function(currentNativeSettings) {
//             state = __extend({},state, currentNativeSettings);
//             dfd.resolve(state);
//         };
//         dfd.resolve(state);

        state = __extend({},state, currentNativeSettings);

		return state;
    };

    var _ctx = function (options) {
        state = __extend({},state, options || {});
        return this;
    };

    var _send = function () {
        return __send([KEY_LOCAL_STORAGE_LOGS, KEY_LOCAL_STORAGE_SWAP]);
    };

    var _metadata = function (obj) {

        if (typeof obj === 'object') {
            state.metadata = obj;
        }

        return this;
    };

    var _updateConfigFromServer = function() {
        
         var appName = metadataHeader.mfpAppName ;
         var platform = metadataHeader.os ;
         var version = metadataHeader.mfpAppVersion;
         
//          var appName = 'com.hackaton.ibm.analyticstestapp';
//          var platform = 'android';
//          var version = '1.0';
         var getConfigUrl = REQ_UPDATE_CONFIG + '/' + appName + '/' + platform + '/' + version + '?isAjaxRequest=true';
         __ajax({}, getConfigUrl,'GET')
			.then(function (metadata) {
                __processUpdateConfig(metadata[1]);
			})
			.catch(function (err) {
			  console.error('call to xhr failed', err.statusText);
		});
    };

    var __setServerOverrides = function(config) {
        var udf;  // undefined
        state.levelFromServer = udf;
        state.captureFromServer = udf;
        state.filtersFromServer = udf;
        _config({levelFromServer: config.level, captureFromServer: config.capture, filtersFromServer: config.filters});
    };
    
    //TBD Appession
    function _generateAppSessionID() {
			var d = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
			});
			return uuid;
	};

	function logAnalyticsCrash(errorEvt) {
	    var duration = new Date().getTime() - startupTime;
	    var filename = errorEvt.filename;
	    var linenumber = errorEvt.lineno;
	    var errorMessage = errorEvt.message;
	    var method = 'none';
	    var stack = [];
	    if(errorEvt.error != null){
	    	var errstack = errorEvt.error.stack;
	    	stack = errstack.split('\n');
	    }
	    var caller = "";
	    for(var i = 1; i<stack.length; ++i){
			var line = stack[i];
			if(line.indexOf("ibmmobilefirstplatformfoundationlogger") == -1 && line.indexOf("ibmmobilefirstplatformfoundationanalytics") == -1){
				caller = line;
				break;
			}
		}
		if(caller != ""){
			var parsed = formatStackLine(caller);
			method = parsed.method;
		}
	    var type = errorEvt.type;
    	var meta = {
    	 '$category' : 'appSession',
    	 '$duration' : duration,
    	 '$closedBy' : 'CRASH',
    	 '$appSessionID' : appSessionID,
    	 '$class' : 'Object',
    	 '$file' : filename,
    	 '$method' : method,
    	 '$line' : linenumber,
    	 '$src' : 'js',
    	};
    	_metadata(meta);
    	_ctx({pkg: 'wl.analytics'});
    	__log('appSession','ANALYTICS');

		var meta2 = {
    	 '$class' : 'Object',
    	 '$file' : filename,
    	 '$method' : method,
    	 '$line' : linenumber,
    	 '$src' : 'js',
    	 '$stacktrace' :  stack,
    	 '$exceptionMessage' : errorMessage,
    	 '$exceptionClass' : type
    	};
		_metadata(meta2);
    	_ctx({pkg: 'wl.analytics', level:'FATAL'});
    	__log('Uncaught Exception','FATAL');
	};
	
	function logAnalyticsSessionStart() {
	    appSessionID = _generateAppSessionID();
    	var meta = {
    	 '$category' : 'appSession',
    	 '$appSessionID' : appSessionID
    	};
    	_metadata(meta);
    	_ctx({pkg: 'wl.analytics',level : 'ANALYTICS'});
    	__log('appSession','ANALYTICS');
	};
	
	function logAnalyticsSessionStop() {
	    var duration = new Date().getTime() - startupTime;

	    appSessionID = _generateAppSessionID();
    	var meta = {
    	 '$category' : 'appSession',
    	 '$duration' : duration,
    	 '$closedBy' : 'user',
    	 '$appSessionID' : appSessionID
    	};
    	appSessionID = '';
    	_metadata(meta);
    	_ctx({pkg: 'wl.analytics',level : 'ANALYTICS'});
    	__log('appSession','ANALYTICS');
	};

    function emptyLogs(keys){
            keys.forEach(function(key){
                localStorage.removeItem(key);
            });
    };


    function initErrorHandler(){
        if(window.hasErrorHandler == null){
            window.addEventListener('error', function (evt) {
                logAnalyticsCrash(evt);
                evt.preventDefault();
            });
            window.hasErrorHandler = true;
        }
    };

    function browserName(){
	var browserName  = navigator.appName;
	
	var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var nameOffset,verOffset,ix;

    // In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	   browserName = "Opera";
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	   browserName = "Microsoft Internet Explorer";
	}
	// In Chrome, the true version is after "Chrome" 
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
 	  browserName = "Chrome";
	}
	// In Safari, the true version is after "Safari" or after "Version" 
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	   browserName = "Safari";
	}
	// In Firefox, the true version is after "Firefox" 
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	    browserName = "Firefox";
	}
	// In most other browsers, "name/version" is at the end of userAgent 
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < (verOffset=nAgt.lastIndexOf('/')) ) {
	    browserName = nAgt.substring(nameOffset,verOffset);
	}

	return browserName;
	}


    function _init(deviceID, appName, appVersion){
    	startupTime = new Date().getTime();
    	initErrorHandler();
    	metadataHeader.deviceID = "Undefined";
    	if (deviceID != null && deviceID != ''){
    		metadataHeader.deviceID = deviceID;
    	}
    	metadataHeader.mfpAppVersion = "1.0";
    	if (appVersion != null && appVersion != ''){
    		metadataHeader.mfpAppVersion = appVersion;
    	}
    	metadataHeader.mfpAppName = "MFPWebApp";
    	if (appName != null && appName != ''){
    		metadataHeader.mfpAppName = appName;
    	}
		metadataHeader.os = "web";  // MFP
		metadataHeader.osVersion =  navigator.platform;  // human-readable o/s version; like "MacIntel"
		metadataHeader.brand = navigator.appVersion;  // human-readable brand; 
		metadataHeader.model = browserName();  // human-readable model; like "Chrome"
		metadataHeader.appVersionDisplay = metadataHeader.mfpAppVersion;  // human readable display version
		metadataHeader.appVersionCode = metadataHeader.mfpAppVersion;  // version as known to the app store
		metadataHeader.appStoreId = metadataHeader.mfpAppName; // app pkg name (e.g. com.ibm.MyApp)
		metadataHeader.appStoreLabel = metadataHeader.mfpAppName; 
    	initXHR(XMLHttpRequest, this);

    };

	var __unsetServerOverrides = function() {
		var udf;  // undefined
		state.levelFromServer = udf;
		state.captureFromServer = udf;
		state.filtersFromServer = udf;
		_config({levelFromServer: udf, captureFromServer: udf, filtersFromServer: udf});
	};

 // For web logger state manipulation
  function __state() {
		return state;
  };

   function __updateState(newState) {
		if(newState) {
			state = newState;
		}
   };
       
    function __extend(){
		for(var i=1; i<arguments.length; i++)
			for(var key in arguments[i])
				if(arguments[i].hasOwnProperty(key))
					arguments[0][key] = arguments[i][key];
		return arguments[0];
	};


    var PUBLIC_API = {
        create : _create,
        config : _config,
        status : _status,
        updateConfigFromServer: _updateConfigFromServer,
        send: _send,
        //internal:
        _init: _init,
        _ctx : _ctx,
        _metadata: _metadata,
        _sendAnalytics: __sendAnalytics,  // called by WL.Analytics
        _setServerOverrides: __setServerOverrides,
        _unsetServerOverrides: __unsetServerOverrides,
        //testing:
        __resetState : __resetState  // back to the defaults
        
    };

    __getKeys(priorities).forEach(function (idx) {
        PUBLIC_API[idx] = function () {
            __log([].slice.call(arguments), idx);
        };
    });

    return PUBLIC_API;

}));
