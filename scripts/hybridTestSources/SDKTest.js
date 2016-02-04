
/////////////////////// Test SDK By Eitan //////////////////////

var statusSuccess = {"status":"Success"};

function wlCommonInit(){
      try{
      	 	WL.App.addActionReceiver("MyReceiver", function (receivedAction){
      	 		this[receivedAction.action]();
      	 	});
      	}catch(err){
  //  	  	WL.App.removeActionReceiver("MyReceiver");
  			consvgole.log(err.message);
      	}
    //	WL.NativePage.show("io.cordova.hellocordova.RunTestsActivity",function(data){alert(data);}, {key1 : 'value1'});
}

function testActionReceiver(){
    console.log("This method is tested as it serves as an infrastructure for all of the tests see wlCommonInit");
	WL.App.sendActionToNative("testActionReceiver", statusSuccess);
}

function testSendActionToNative(){
    console.log("This method is tested as it serves as an infrastructure for all of the tests to report status");
	WL.App.sendActionToNative("testSendActionToNative", statusSuccess);
}

function testOnInitWebFrameworkComplete(){
    console.log("This method is tested as it serves as an infrastructure for all of the tests see (MainActivity/MFPAppDelegate)");
	WL.App.sendActionToNative("testSendActionToNative", statusSuccess);
}

function testHandleWebFrameworkInitFailure(){
    console.log("This method is tested as it serves as an infrastructure for all of the tests see (MainActivity/MFPAppDelegate)");
	WL.App.sendActionToNative("testHandleWebFrameworkInitFailure", statusSuccess);
}

function testOnActionReceived(){
    console.log("This method is tested as it serves as an infrastructure for all of the tests see (MainActivity/MFPAppDelegate)");
	WL.App.sendActionToNative("testOnActionReceived", statusSuccess);
}

function testBase64EncodeDecode(){
		WL.SecurityUtils.base64Encode("7").then(function(val) {
				WL.SecurityUtils.base64Decode(val).then(function(val1) {
					if ("7" == val1) {
          				console.log("WL.SecurityUtils.base64Decode: Success.");
          				var data = {"status":"success"};
                    	WL.App.sendActionToNative("testBase64Decode", statusSuccess);
                    }
                    else {
                    	console.log("testBase64Encode failure");
                    	var data = {"status":"Failed calling WL.SecurityUtils.testBase64Decode"};
                        WL.App.sendActionToNative("testBase64Encode", data);
                    }
        		},function(val){
        			console.log("Failed calling WL.SecurityUtils.testBase64Decode:" + val);
        		}).fail(function(){
        			console.log("Failed calling WL.SecurityUtils.testBase64Decode" );
        			var data = {"status":"Failed calling WL.SecurityUtils.testBase64Decode"};
                    WL.App.sendActionToNative("testBase64Decode", data);
        		});

  			console.log("WL.SecurityUtils.base64Encode: Success.");
            WL.App.sendActionToNative("testBase64Encode", statusSuccess);
		},function(val){
			console.log(val);
		}).fail(function(){
			  console.log("testBase64Encode failure");
			  var data = {"status":"Failed calling WL.SecurityUtils.testBase64Decode"};
              WL.App.sendActionToNative("testBase64Encode", data);
		});
}


function testEnableOSNativeEncryption(){
		WL.SecurityUtils.enableOSNativeEncryption(true).then(function(val) {
		  	console.log("WL.SecurityUtils.base64Decode: Success.");
  			var data = {"status":"success"};
            WL.App.sendActionToNative("testEnableOSNativeEncryption", statusSuccess);
		},function(val){
			console.log(val);
		}).fail(function(){
			console.log("Failed calling WL.SecurityUtils.testEnableOSNativeEncryption");
			var data = {"status":"Failed calling WL.SecurityUtils.testEnableOSNativeEncryption"};
			WL.App.sendActionToNative("testEncrypt", data);
		});
}

function testEncryptDecrypt(){
	var key;

	// Generate a key.
	WL.SecurityUtils.keygen({
	  password: 'HelloPassword',
	  salt: Math.random().toString(),
	  iterations: 10000
	}).then(function (res) {
	  // Update the key variable.
	  key = res;
	  // Encrypt text.
	  return WL.SecurityUtils.encrypt({
		key: key,
		text: 'My secret text'
	  });
	}).then(function (res) {
	  // Append the key to the result object from encrypt.
	  res.key = key;
	  // Decrypt.
	  return WL.SecurityUtils.decrypt(res);
	}).then(function (res) {
	  // Remove the key from memory.
	  key = null;
	  console.log("secret:"+res);
	  WL.App.sendActionToNative("test101", {"status":"Success"});
	  //res => 'My secret text'
	}).fail(function (err) {
	  // Handle failure in any of the previously called APIs.
		console.log("testEncryptDecrypt:"+failed);
		WL.App.sendActionToNative("test101", {"status":"Failed"});
	});
}


 function testGetServerUrl(){
   try{
 	WL.App.getServerUrl(
 	function(url){
 		console.log("WL.App.getServerUrl:"+url);
		WL.App.sendActionToNative("testGetServerUrl", statusSuccess);
 	},function(err){
		var data = {"status":"testGetServerUrl failure"};
		WL.App.sendActionToNative("testGetServerUrl", data);
 	});
 	}catch(err){
			var data = {"status":"testGetServerUrl failure"};
			WL.App.sendActionToNative("testGetServerUrl", data);
     }
  }

function testSetServerUrl(){

    WL.App.setServerUrl("http://9.148.49.79:9080/mfp/api",
    function(url){
         console.log("WL.App.setServerUrl:"+url);
		WL.App.sendActionToNative("testSetServerUrl", statusSuccess);
    },function(err){
         console.log("WL.App.setServerUrl: Failure");
		var data = {"status":"testSetServerUrl failure"};
		WL.App.sendActionToNative("testSetServerUrl", data);
    });
//    WL.Client.reloadApp();
}

function testLocalRandomString(){
		WL.SecurityUtils.localRandomString().then(function(val) {
		  	console.log("WL.ecurityUtils.LocalRandomString: Success. " + val);
            WL.App.sendActionToNative("testEnableOSNativeEncryption", statusSuccess);
		},function(val){
			console.log(val);
		}).fail(function(){
			console.log("Failed calling WL.ecurityUtils.LocalRandomString:");
			var data = {"status":"Failed calling WL.SecurityUtils.testEnableOSNativeEncryption"};
			WL.App.sendActionToNative("testEncrypt", data);
		});
}

function testWLClient(){
	try{
		WL.Client.getEnvironment();
		WL.Client.getCookies().then(function(val) {
		  	console.log("testWLClient:WL.Client.getCookies: Success.");
		  	WL.App.sendActionToNative("testWLClient", statusSuccess);
		},function(val){
			console.log(val);
		}).fail(function(){
			console.log("Failed calling WL.Client.getCookies");
			var data = {"status":"Failed calling WL.Client.getCookies"};
			WL.App.sendActionToNative("testWLClient", data);
		});
	}catch(err){
		var data = {"status":"testWLClient failure"};
		WL.App.sendActionToNative("testWLClient", data);
	}
}

function testAddHeader(){
	try{
		var request = new WLResourceRequest('http://httpbin.org/headers', WLResourceRequest.GET);
		request.setQueryParameter('params', [5, 6]);
		request.getQueryParameters();
		request.setTimeout(60000);
		request.addHeader("WLHYBRIDHEADER", "MYHEADER")
		if (request.getTimeout() != 60000){
				var data = {"status":"testAddHeader - request.getTimeout failure"};
				return WL.App.sendActionToNative("testResourceRequest", data);
		}
		request.getTimeout();
		request.send().then(
      	function(response) {
      	    var response = JSON.stringify(response);
      	 	console.log("testAddHeader " + response);
      	 	if (response.indexOf("MYHEADER") > -1) {
				WL.App.sendActionToNative("testAddHeader", statusSuccess);
			}
			else {
				var data = {"status":"testAddHeader failure"};
				WL.App.sendActionToNative("testAddHeader", data);
			}
          // success flow, the result can be found in response.responseJSON
      	},
      	function(error) {
          // failure flow
          // the error code and description can be found in error.errorCode and error.errorMsg fields respectively
      	}
 		).fail(function(){
 			console.log("testAddHeader failure");
			var data = {"status":"testAddHeader failure"};
			WL.App.sendActionToNative("testAddHeader", data);
 		});
	}catch(err){
		var data = {"status":"testAddHeader failure"};
		WL.App.sendActionToNative("testAddHeader", data);
	}
}

function testWLGetEnvironment() {
	try{
	    console.log("user agaent: " + navigator.userAgent);
	    console.log("testWLgetEnvironment: " + WL.Client.getEnvironment());
	    if (navigator.userAgent.indexOf("Android") > -1 && WL.Client.getEnvironment() === WL.Environment.ANDROID) {
	    	console.log("testWLgetEnvironment: Success.");
            WL.App.sendActionToNative("testWLgetEnvironment", statusSuccess);
		}
		else if (navigator.userAgent.indexOf("iPhone") > -1 && WL.Client.getEnvironment() === WL.Environment.IPHONE) {
	    	console.log("testWLgetEnvironment: Success.");
            WL.App.sendActionToNative("testWLgetEnvironment", statusSuccess);
		}
		else {
			var data = {"status":"Failed testWLgetEnvironment"};
        	WL.App.sendActionToNative("testWLClient", data);
		}
	}catch(err){
		var data = {"status":"testWLgetEnvironment"};
		WL.App.sendActionToNative("testWLgetEnvironment", data);
	}
}

function testWLClientCookie(){
	try{
	WL.Client.setCookie({
      name: 'MFPCookie',
      value: 'cookieValue',
      domain: 'google.com',
      path: '/', // all paths
      expires: 0 // never expires
    }).then(function() {
      		WL.Client.getCookies().then(function(val) {
      		var cookies = JSON.stringify(val);
      		  	console.log("testWLClient:WL.Client.getCookies: Success. " + cookies);
      		  	if (cookies.indexOf("MFPCookie") > -1) {
      		  	      WL.App.sendActionToNative("testWLClient", statusSuccess);
      		  	}
      		},function(val){
      			console.log(val);
      		}).fail(function(){
      			console.log("Failed calling testWLClientCookie");
      			var data = {"status":"Failed calling testWLClientCookie"};
      			WL.App.sendActionToNative("testWLClient", data);
      		})
    }
    ,function(val){
         console.log(val);
      }).fail(function(){
             			console.log("Failed calling WL.Client.getCookies");
             			var data = {"status":"Failed calling WL.Client.getCookies"};
             			WL.App.sendActionToNative("testWLClient", data);
             		}
     );
	}catch(err){
		var data = {"status":"testWLClientCookie failure"};
		WL.App.sendActionToNative("testWLClientCookie", data);
	}
}

function testErrorMessage() {
    console.log("testErrorMessage: " + WL.App.getErrorMessage("string error"));
    if (WL.App.getErrorMessage("string error") === "string error") {
    	return WL.App.sendActionToNative("testErrorMessage", statusSuccess);
    }
    else {
    	var data = {"status":"testErrorMessage failure"};
    	return WL.App.sendActionToNative("testErrorMessage", data);
    }
}

function testSplashScreen() {
    console.log("testSplashScreen");
	try {
		WL.App.showSplashScreen();
		setTimeout(function(){
    	    WL.App.hideSplashScreen();
    		return WL.App.sendActionToNative("testSplashScreen", statusSuccess);
		}, 1000);
	}catch(err){
    	var data = {"status":"testSplashScreen failure"};
    	WL.App.sendActionToNative("testAddHeader", data);
    }
}

function testResourceRequest(){
	try{
		var request = new WLResourceRequest('/adapters/account/balance', WLResourceRequest.GET);
		request.setQueryParameter('params', [5, 6]);
		request.getQueryParameters();
		request.setTimeout(60000);
		if (request.getTimeout() != 60000){
				var data = {"status":"testResourceRequest - request.getTimeout failure"};
				return WL.App.sendActionToNative("testResourceRequest", data);
		}
		request.getTimeout();
		if (request.getUrl() != "/adapters/account/balance"){
			var data = {"status":"testResourceRequest - request.getUrl failure"};
			return WL.App.sendActionToNative("testResourceRequest", data);
		}

		sampleAppRealmChallengeHandler = WL.Client.createWLChallengeHandler("usernamePassword");

		sampleAppRealmChallengeHandler.handleChallenge = function(challenge) {
			console.log("handleChallenge :: authenticationRequired :: " + challenge.authenticationRequired);

			if (challenge.authenticationRequired === true){

				if (challenge.message){
					console.log(challenge.message);
				}
			}
			var credentials = {
					user : "a",
					password : "a"
				};
			sampleAppRealmChallengeHandler.submitChallengeAnswer(credentials);
		};

		sampleAppRealmChallengeHandler.processSuccess = function (data){
			console.log(JSON.stringify(data));
		}

		sampleAppRealmChallengeHandler.handleFailure = function (data){
			console.log(data);
		}

		request.send().then(
      	function(response) {
			WL.App.sendActionToNative("testResourceRequest", statusSuccess);
          // success flow, the result can be found in response.responseJSON
      	},
      	function(error) {
          // failure flow
          // the error code and description can be found in error.errorCode and error.errorMsg fields respectively
      	}
 		).fail(function(){
 			console.log("testResourceRequest failure");
			var data = {"status":"testResourceRequest failure"};
			WL.App.sendActionToNative("testResourceRequest", data);
 		});
	}catch(err){
		var data = {"status":"testResourceRequest failure"};
		WL.App.sendActionToNative("testResourceRequest", data);
	}
}

function test101(){
	try{
		console.log("test101 OK");
		WL.App.sendActionToNative("test101", {"status":"Success"});
	}catch(err){
		WL.App.sendActionToNative("test101", {"status":"test101 failure"});
	}
}

function testLogger(){

	WL.Logger.ctx({pkg: 'wl.test'}).trace('trace', 'testLogger:trace message');
	WL.Logger.ctx({pkg: 'wl.test'}).debug('debug', [1,2,3], {hello: 'world'});
	WL.Logger.ctx({pkg: 'wl.test'}).log('log', 'testLogger:log message');
	WL.Logger.ctx({pkg: 'wl.test'}).info('info', 1, 2, 3);
	WL.Logger.ctx({pkg: 'wl.test'}).warn('warn', 'testLogger: warning');
	WL.Logger.ctx({pkg: 'wl.test'}).error('error', new Error('testLogger:oh no'));
	WL.Logger.ctx({pkg: 'wl.test'}).fatal('fatal', 'testLogger: fatal message');
    WL.App.sendActionToNative("testLogger", statusSuccess);

}

function testInvokeProcedure(){
	var invocationData = {
			adapter : "testInvoke",
			procedure: "hello",
			parameters: []
	};

	WL.Client.invokeProcedure(invocationData, {
		onSuccess: invokeProcedureOK,
		onFailure: invokeProcedureFAIL
	});

	function invokeProcedureOK(response) {
		console.log("ok");
		WL.App.sendActionToNative("testInvokeProvedure", statusSuccess);
	}

	function invokeProcedureFAIL(response) {
		console.error("fail");
		var data = {"status":"testInvokeProvedure failure"};
        WL.App.sendActionToNative("testInvokeProvedure", data);
	}
}

/////////////////////// Test SDK By Eitan //////////////////////