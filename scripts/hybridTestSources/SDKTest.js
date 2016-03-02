
/////////////////////// Test SDK By Eitan //////////////////////

var statusSuccess = {"status":"Success"};

function testSDK(){
	testFailurePinTrustedCertificatePublicKey();
}

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
        			var data = {"status":"Failed calling WL.SecurityUtils.testBase64Decode:" + getErrorDesc(val)};
                    WL.App.sendActionToNative("testBase64Decode", data);
                    console.log("Failed calling WL.SecurityUtils.testBase64Decode" );
        		});

		},function(val){
			console.log("testBase64Encode failure:" + val);
			var data = {"status":"Failed calling WL.SecurityUtils.testBase64Decode:" + getErrorDesc(val)};
            WL.App.sendActionToNative("testBase64Encode", data);
		});
}


function testEnableOSNativeEncryption(){
        if (navigator.userAgent.indexOf("Android") > -1 && WL.Client.getEnvironment() === WL.Environment.ANDROID) {
	    	console.log("Android Environment, skipping test");
            return WL.App.sendActionToNative("testEnableOSNativeEncryption", statusSuccess);
		}
		WL.SecurityUtils.enableOSNativeEncryption(true).then(function(val) {
		  	console.log("WL.SecurityUtils.base64Decode: Success.");
  			var data = {"status":"success"};
            WL.App.sendActionToNative("testEnableOSNativeEncryption", statusSuccess);
		},function(val){
			console.log("Failed calling WL.SecurityUtils.testEnableOSNativeEncryption");
			console.log(val);
			var data = {"status":"Failed calling WL.SecurityUtils.testEnableOSNativeEncryption:" + getErrorDesc(val)};
			WL.App.sendActionToNative("testEncrypt", data);
		});
}

function testDisableOSNativeEncryption(){
        if (navigator.userAgent.indexOf("Android") > -1 && WL.Client.getEnvironment() === WL.Environment.ANDROID) {
	    	console.log("Android Environment, skipping test");
            return WL.App.sendActionToNative("testEnableOSNativeEncryption", statusSuccess);
		}
		WL.SecurityUtils.enableOSNativeEncryption(false).then(function(val) {
            console.log("was able to call WL.SecurityUtils.testEnableOSNativeEncryption");
			var data = {"status":"Failed: was able to call WL.SecurityUtils.testEnableOSNativeEncryption"};
			WL.App.sendActionToNative("testEncrypt", data);
		},function(val){
			console.log(val);
            if(val.msg.indexOf("Missing IBM OpenSSL bridge framework.") > -1){
				WL.App.sendActionToNative("testDisableOSNativeEncryption", statusSuccess); 
            }
            else{
            	var data = {"status":"Failed, expecting different error msg than: " + getErrorDesc(val)};
				WL.App.sendActionToNative("testDisableOSNativeEncryption", data);
            }
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
      if(res=='My secret text'){
	       WL.App.sendActionToNative("testEncryptDecrypt", {"status":"Success"});
      }
      else{
          WL.App.sendActionToNative("testEncryptDecrypt", {"status":"Decrypt failed"});
      }
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

	var data = {"status":"testSetServerUrl failure"};
    WL.App.setServerUrl("http://ibobs-mac-mini.haifa.ibm.com:9080/mfp/api/",
    function(url){
         console.log("WL.App.setServerUrl:"+url);
         WL.App.getServerUrl(
 		function(url2){
 			console.log("WL.App.getServerUrl:"+url2);
 			if(url2=="http://ibobs-mac-mini.haifa.ibm.com:9080/mfp/api/"){
 			WL.App.sendActionToNative("testGetServerUrl", statusSuccess);
 			}
 			else
 			{
 			WL.App.sendActionToNative("testSetServerUrl", data);
 			}
			
 		},function(err){
 			console.log("WL.App.getServerUrl: Failure");
			WL.App.sendActionToNative("testSetServerUrl", data);
 		});
		
    },function(err){
         console.log("WL.App.setServerUrl: Failure");
		 WL.App.sendActionToNative("testSetServerUrl", data);
    });
//    WL.Client.reloadApp();
}

function testLocalRandomString(){
		WL.SecurityUtils.localRandomString().then(function(val) {
		  	console.log("WL.ecurityUtils.LocalRandomString: Success. " + val);
            WL.App.sendActionToNative("testEnableOSNativeEncryption", statusSuccess);
		},function(val){
			console.log("Failed calling WL.ecurityUtils.LocalRandomString:");
			var data = {"status":"Failed calling WL.SecurityUtils.testEnableOSNativeEncryption:" + getErrorDesc(val)};
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
			console.log("Failed calling WL.Client.getCookies");
			console.log(val);
			var data = {"status":"Failed calling WL.Client.getCookies:" + getErrorDesc(val)};
			WL.App.sendActionToNative("testWLClient", data);
		});
	}catch(err){
		var data = {"status":"testWLClient failure:" + getErrorDesc(err)};
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
      	 	console.log("testAddHeader failure");
          	var data = {"status":"testAddHeader failure:" + getErrorDesc(error)};
			WL.App.sendActionToNative("testAddHeader", data);
      	}
 		);
	}catch(err){
		var data = {"status":"testAddHeader failure:" + getErrorDesc(err)};
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
		var data = {"status":"testWLgetEnvironment:" + getErrorDesc(err)};
		WL.App.sendActionToNative("testWLgetEnvironment", data);
	}
}

function testWLClientCookie(){
	try{
	WL.Client.setCookie({
          name: 'MFPCookie2',
          value: 'cookieValue',
          domain: 'google.com',
          path: '/', // all paths
          expires: -1 // never expires
        }).then(function(){
            WL.Client.deleteCookie('MFPCookie2').then(function() {
               	WL.Client.setCookie({
                name: 'MFPCookie',
                value: 'cookieValue',
                domain: 'google.com',
                path: '/', // all paths
                expires: -1 // never expires
                }).then(function() {
      		        WL.Client.getCookies().then(function(val) {
      		        var cookies = JSON.stringify(val);
      		  	     console.log("testWLClientCookie: Success. " + cookies);
      		  	     if (cookies.indexOf("MFPCookie") > -1 && cookies.indexOf("MFPCookie2") <= -1) {
      		  	      WL.App.sendActionToNative("testWLClientCookie", statusSuccess);
      		  	      }
                      else{
                      var data = {"status":"Failed wrong cookies data"};
      			      WL.App.sendActionToNative("testWLClient", data); 
                      }
      		    },function(val){
      		    	console.log("Failed calling testWLClientCookie");
      			   console.log(val);
      			   var data = {"status":"Failed calling testWLClientCookie:" + getErrorDesc(val)};
      			   WL.App.sendActionToNative("testWLClient", data);
      		    });
    	}
    	,function(val){
         console.log(val);
         console.log("Failed calling WL.Client.getCookies");
         var data = {"status":"Failed calling WL.Client.getCookies:" + getErrorDesc(val)};
          WL.App.sendActionToNative("testWLClient", data);
      	}); 
      });
     });
	}catch(err){
		var data = {"status":"testWLClientCookie failure:" + getErrorDesc(err)};
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
    	var data = {"status":"testSplashScreen failure:" + getErrorDesc(err)};
    	WL.App.sendActionToNative("testAddHeader", data);
    }
}

function testResourceRequest(){
	testResourceRequest();
}

function testResourceRequestGetQuery(){
	testResourceRequest("get-query");
}

function testResourceRequestGetForm(){
	testResourceRequest("get-form");
}

function testResourceRequestPostQuery(){
	testResourceRequest("post-query");
}

function testResourceRequestPostForm(){
	testResourceRequest("post-form");
}

function testResourceRequest(type){
	try{
		var request = new WLResourceRequest('/adapters/account/balance', WLResourceRequest.GET);
		if (!type) {
		    request = new WLResourceRequest('/adapters/account/balance', WLResourceRequest.GET);
			request.setQueryParameter('params', [5, 6]);
        	request.getQueryParameters();
		}
		else if (type == "get-query") {
			request = new WLResourceRequest('/adapters/bankAdapterUnprotected/view/balanceGet', WLResourceRequest.GET);
        	request.setQueryParameter('params', [5, 6]);
		}
		else if (type == "get-form") {
		    request = new WLResourceRequest('/adapters/bankAdapterUnprotected/view/balanceGet', WLResourceRequest.GET);
            request.sendFormParameters({ "params" : "[5, 6])" });
		}
		else if (type == "post-query") {
		    request = new WLResourceRequest('/adapters/bankAdapterUnprotected/view/balancePost', WLResourceRequest.POST);
        	request.setQueryParameter('params', [5, 6]);
		}
		else if (type == "post-form") {
			request = new WLResourceRequest('/adapters/bankAdapterUnprotected/view/balancePost', WLResourceRequest.POST);
        	request.sendFormParameters({ "params" : "[5, 6])" });
        }

		request.setTimeout(60000);
		if (request.getTimeout() != 60000){
				var data = {"status":"testResourceRequest - request.getTimeout failure"};
				return WL.App.sendActionToNative("testResourceRequest", data);
		}
		request.getTimeout();
		if (request.getUrl().indexOf("balance") <= -1){
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
 			var data = {"status": "Failure" + getErrorDesc(error)};
			WL.App.sendActionToNative("testResourceRequest", data);
			console.log("testResourceRequest failure");
      	}
 		);
	}catch(err){
	 	var data = {"status": "Failure" + getErrorDesc(err)};
		WL.App.sendActionToNative("testResourceRequest", data);
	}
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
		var data = {"status":"failure:" + getErrorDesc(response)};
        WL.App.sendActionToNative("testInvokeProvedure", data);
	}
}


function testRemoveActionReceiver(){
	try{
      	WL.App.addActionReceiver("MyTestReceiver", function (receivedAction){
      	});
      	WL.App.removeActionReceiver("MyTestReceiver");
      	WL.App.sendActionToNative("testRemoveActionReceiver", statusSuccess);
      }catch(err){
      		WL.App.sendActionToNative("testRemoveActionReceiver", {"status":"testRemoveActionReceiver failure"});
      }
}

function testInit() {
	try{	    
	  WL.Client.init({
	    onSuccess: function(){
	    	WL.App.sendActionToNative("testInit", statusSuccess);
	    	console.log("testInit: Success"); 
	    },
	    onFailure: function(){
	    	var data = {"status":"testInit Failed"};
			WL.App.sendActionToNative("testInit", data);
			console.log("testInit: Failure"); 
	    }	    
	  });
	}catch(err){
		var data = {"status":"testInit Failed:"+ getErrorDesc(err)};
		WL.App.sendActionToNative("testInit", data);
	}
}

function testIsConnected() {
	try{
	    var conn = WL.Client.isConnected();
	    console.log("testIsConnected: " + conn);
	    if (conn) {
      		WL.App.sendActionToNative("testIsConnected", statusSuccess);
      	}
      	else {
            var data = {"status":"testIsConnected failure: not connected"};
            WL.App.sendActionToNative("testIsConnected", data);
         }
	}catch(err){
		var data = {"status":"testIsConnected Failed:" + getErrorDesc(err)};
		WL.App.sendActionToNative("testIsConnected", data);
	}
}

function testGlobalHeader(){
	try{
	    WL.Client.addGlobalHeader("WLHYBRIDHEADER", "MYHEADER");
	    WL.Client.addGlobalHeader("WLHYBRIDHEADER2", "MYHEADER2");
	    var request = getRequest();
		request.send().then(
      	function(response) {
      	    var response = JSON.stringify(response);
      	 	console.log("testAddHeader " + response);
      	 	if (response.indexOf("MYHEADER") > -1) {
      	 		WL.Client.removeGlobalHeader("WLHYBRIDHEADER2");
      	 		testRemoveGlobalHeader();
			}
			else {
				var data = {"status":"testGlobalHeader failure"};
				WL.App.sendActionToNative("testGlobalHeader", data);
			}
          // success flow, the result can be found in response.responseJSON
      	},
      	function(error) {
      		var data = {"status":"testGlobalHeader failure:" + getErrorDesc(error)};
			WL.App.sendActionToNative("testGlobalHeader", data);
			console.log("testGlobalHeader failure");
        }
 		);
	}catch(err){
		var data = {"status":"testGlobalHeader failure:"+ getErrorDesc(err)};
		WL.App.sendActionToNative("testGlobalHeader", data);
	}
}

function testRemoveGlobalHeader(){
	try{
        var request = getRequest();
		request.send().then(
			function(response) {
				var response = JSON.stringify(response);
				console.log("testAddHeader " + response);
				if (response.indexOf("MYHEADER2") > -1) {
					var data = {"status":"testGlobalHeader remove failure"};
					WL.App.sendActionToNative("testGlobalHeader", data);
				}
				else {
					WL.App.sendActionToNative("testGlobalHeader", statusSuccess);
				}
			  // success flow, the result can be found in response.responseJSON
			},
			function(error) {
				console.log("testGlobalHeader remove failure");
				var data = {"status":"testGlobalHeader remove failure"};
				WL.App.sendActionToNative("testGlobalHeader", data);
			}
 		);
	}catch(err){
		var data = {"status":"testGlobalHeader remove failure:" + getErrorDesc(err)};
		WL.App.sendActionToNative("testGlobalHeader", data);
	}
}

function getRequest(){
		var request = new WLResourceRequest('http://httpbin.org/headers', WLResourceRequest.GET);
		request.setQueryParameter('params', [5, 6]);
		request.getQueryParameters();
		request.setTimeout(60000);
		if (request.getTimeout() != 60000){
				var data = {"status":"testGlobalHeader remove - request.getTimeout failure"};
				return WL.App.sendActionToNative("testGlobalHeader", data);
		}
		request.getTimeout();
		return request;
}

function testSimpleDialog() {
	try{
		WL.SimpleDialog.show(
    	"My Title", "My Text",
    	[{text: "First Button", handler: function() {WL.Logger.debug("First button pressed"); }}]
    )	;
      	WL.App.sendActionToNative("testSimpleDialog", statusSuccess);
	}catch(err){
		var data = {"status":"testSimpleDialog Failed"};
		WL.App.sendActionToNative("testSimpleDialog", data);
	}
}

function testReloadApp() {
	try{
	    console.log("testReloadApp: " + WL.Client.reloadApp());
      	WL.App.sendActionToNative("testReloadApp", statusSuccess);
	}catch(err){
		var data = {"status":"testReloadApp Failed"};
		WL.App.sendActionToNative("testReloadApp", data);
	}
}

function testHeartbeat() {
	try{
	    console.log("testHartbeat: " + WL.Client.setHeartBeatInterval(10));
      	WL.App.sendActionToNative("testHartbeat", statusSuccess);
	}catch(err){
		var data = {"status":"testHartbeat Failed"};
		WL.App.sendActionToNative("testHartbeat", data);
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
		var data = {"status":"testInvokeProvedure failure:" + getErrorDesc(response)};
        WL.App.sendActionToNative("testInvokeProvedure", data);
	}
}

function testInvokeProcedureHeaders(){

	WL.Client.addGlobalHeader("MyCustomHeader","1234567");
	var invocationData = {
			adapter : "testInvoke",
			procedure: "globalHeader",
			parameters: []
	};

	WL.Client.invokeProcedure(invocationData, {
		onSuccess: invokeProcedureOK,
		onFailure: invokeProcedureFAIL
	});

	function invokeProcedureOK(response) {
		if(response.invocationResult.MyCustomHeader != "1234567"){
        	var data = {"status":"testInvokeProcedureHeaders failure"};
        	WL.App.sendActionToNative("testInvokeProcedureHeaders", data);
        } else {
        	WL.App.sendActionToNative("testInvokeProcedureHeaders", statusSuccess);
        }

	}

	function invokeProcedureFAIL(response) {
		var data = {"status":"testInvokeProcedureHeaders failure:" + getErrorDesc(response)};
        WL.App.sendActionToNative("testInvokeProcedureHeaders", data);
	}
}

function testInvokeProcedureEncodingHeadersPositive(){
     testInvokeProcedureEncodingHeaders(true);
}

function testInvokeProcedureEncodingHeadersNegative(){
     testInvokeProcedureEncodingHeaders(false);
}

function testInvokeProcedureEncodingHeaders(enable){

	var invocationData = {
			adapter : "testInvoke",
			procedure: "encoding",
			compressResponse: enable,
			parameters: []
	};

	WL.Client.invokeProcedure(invocationData, {
		onSuccess: invokeProcedureOK,
		onFailure: invokeProcedureFAIL
	});

	function invokeProcedureOK(response) {
        if(enable && response.invocationResult.EncodingHeader.indexOf("gzip")<=-1){
        	var data = {"status":"testInvokeProcedureEncodingHeaders failure"};
        	WL.App.sendActionToNative("testInvokeProcedureEncodingHeaders", data);
        }
        else if(!enable && response.invocationResult.EncodingHeader != null){
			var data = {"status":"testInvokeProcedureEncodingHeaders failure"};
			WL.App.sendActionToNative("testInvokeProcedureEncodingHeaders", data);
		}
        else {
        	WL.App.sendActionToNative("testInvokeProcedureEncodingHeaders", statusSuccess);
        }

	}
	function invokeProcedureFAIL(response) {
		var data = {"status":"testInvokeProcedureEncodingHeaders failure:" + getErrorDesc(response)};
        WL.App.sendActionToNative("testInvokeProcedureEncodingHeaders", data);
	}
}

function testShowNativePage(){

	if (navigator.userAgent.indexOf("iPhone") > -1 && WL.Client.getEnvironment() === WL.Environment.IPHONE) {
	    var params = {
        	nameParam : 'text'
    	};
    
    	WL.NativePage.show("ShowNativeTest",function(data){
                WL.App.sendActionToNative("testShowNativePage", statusSuccess);
        },params);
	}
	else{
	    WL.App.sendActionToNative("testShowNativePage", statusSuccess);
	}
}

function testSuccessfullPinTrustedCertificatePublicKey(){
   pinCertificateAndGetGoogleResource("testSuccessfullPinTrustedCertificatePublicKey","google.cer");
}

function testFailurePinTrustedCertificatePublicKey(){
	pinCertificateAndGetGoogleResource("testFailurePinTrustedCertificatePublicKey","ibm.cer");  
}

function testGET(){
	testMethod('get', null);
}

function testGETWithData(){
	testMethod('get', "data");
}

function testHEAD(){
	testMethod('head', null);
}

function testHEADWithData(){
	testMethod('head', "data");
}

function testOPTIONSWithData(){
	testMethod('options', "data");
}

function testOPTIONS(){
	testMethod('options', null);
}

function testDELETEWithData(){
	testMethod('delete', "data");
}

function testDELETE(){
	testMethod('delete', null);
}

function testPUT(){
	testMethod('put', null);
}

function testPUTWithData(){
	testMethod('put', "data");
}

function testPOST(){
	testMethod('post', null);
}

function testPOSTWithData(){
	testMethod('post', "data");
}

function testMethod(method, data){
	try{
	    var _method = method;
	    if (method == 'options') _method = 'get';
	    if (method == 'head') _method = 'get';
		var request = new WLResourceRequest('http://httpbin.org/' + _method, method.toUpperCase());
		request.setQueryParameter('params', 5);
        if (JSON.stringify(request.getQueryParameters())!="{\"params\":5}") {
            var data = {"status":"testMethod - request.setQueryParameter failure"};
			return WL.App.sendActionToNative("testMethod", data);
        }
        request.setQueryParameters({'key1':'value1','key2':6});
        if (JSON.stringify(request.getQueryParameters())!="{\"key1\":\"value1\",\"key2\":6}") {
            var data = {"status":"testMethod - request.setQueryParameters failure"};
			return WL.App.sendActionToNative("testMethod", data);
        }
		request.setTimeout(60000);
		if (request.getTimeout() != 60000){
				var data = {"status":"testMethod - request.getTimeout failure"};
				return WL.App.sendActionToNative("testMethod", data);
		}
		if (request.getMethod() != method.toUpperCase()){
			var data = {"status":"testResourceRequest - request.getMethod failure"};
			return WL.App.sendActionToNative("testResourceRequest", data);
		}
		request.send(data).then(
      	function(response) {
      	    var response = JSON.stringify(response);
      	 	console.log("testMethod " + response);
      	 	if (response.indexOf("200") > -1) {
				WL.App.sendActionToNative("testMethod", statusSuccess);
			}
			else {
				var data = {"status":"testMethod failure"};
				WL.App.sendActionToNative("testMethod", data);
			}
          // success flow, the result can be found in response.responseJSON
      	},
      	function(error) {
          // failure flow
          // the error code and description can be found in error.errorCode and error.errorMsg fields respectively
          	var data = {"status":"testMethod failure:" + getErrorDesc(error)};
			WL.App.sendActionToNative("testMethod", data);
			console.log("testMethod failure");

      	}
 		);
	}catch(err){
		var data = {"status":"testMethod failure:" + getErrorDesc(err)};
		WL.App.sendActionToNative("testMethod	", data);
	}
}

function testHeaders() {
    try{
	    var request = new WLResourceRequest('http://httpbin.org/headers', WLResourceRequest.GET);
        request.addHeader("WLHEADER", "MYHEADER");
	    request.setHeader("WLHEADER2", "MYHEADER2");
        var statusFailure = {"status":"Failure header value is different than expected"};
        if(request.getHeader("WLHEADER")!= "MYHEADER" || request.getHeader("WLHEADER2")!= "MYHEADER2"){
		   return WL.App.sendActionToNative("testHeaders", statusFailure);
        }
        request.setHeader("WLHEADER","MYHEADER1");
         if(request.getHeader("WLHEADER")!= "MYHEADER1"){
		   return WL.App.sendActionToNative("testHeaders", statusFailure);
        }
		j1=JSON.stringify(request.getHeaders())
		if(JSON.stringify(request.getHeaders())!= "{\"WLHEADER2\":\"MYHEADER2\",\"WLHEADER\":\"MYHEADER1\"}"){
           statusFailure = {"status":"Failure getHeaders values are different than expected"};
           return WL.App.sendActionToNative("testHeaders", statusFailure);
        }
        request.setHeaders({"WLHEADER":"MYHEADER","WLHEADER3":"MYHEADER3"});
        if(request.getHeader("WLHEADER")!= "MYHEADER" || request.getHeader("WLHEADER3")!= "MYHEADER3"){
		   return WL.App.sendActionToNative("testHeaders", statusFailure);
        }
        if(request.getHeader("WLHEADER5")!= undefined){
		   return WL.App.sendActionToNative("testHeaders", statusFailure);
        }
        if(request.getHeaders("WLHEADER5")!= undefined){
		   return WL.App.sendActionToNative("testHeaders", statusFailure);
        }
		request.setHeader("WLHEADER2", "MYHEADER2");
        j1=JSON.stringify(request.getHeaders())
        j2=JSON.stringify(request.getHeaders("WLHEADER2"))
        j3=JSON.stringify(request.getHeaderNames())
		if(JSON.stringify(request.getHeaders())!= "{\"WLHEADER\":\"MYHEADER\",\"WLHEADER3\":\"MYHEADER3\",\"WLHEADER2\":\"MYHEADER2\"}"){
           statusFailure = {"status":"Failure getHeaders values are different than expected"};
           return WL.App.sendActionToNative("testHeaders", statusFailure);
        }
        if(JSON.stringify(request.getHeaders("WLHEADER2"))!= "[\"MYHEADER2\"]"){
           statusFailure = {"status":"Failure getHeaders values are different than expected"};
           return WL.App.sendActionToNative("testHeaders", statusFailure);
        }
        if(JSON.stringify(request.getHeaderNames())!="[\"WLHEADER\",\"WLHEADER3\",\"WLHEADER2\"]"){
            statusFailure = {"status":"Failure getHeaderNames values are different than expected"};
            return WL.App.sendActionToNative("testHeaders", statusFailure);
        }

		request.send().then(
      	function(response) {
      	    var response = JSON.stringify(response);
      	 	console.log("testAddHeader " + response);
      	 	if (response.indexOf("MYHEADER") > -1 && response.indexOf("MYHEADER2") && response.indexOf("MYHEADER3")
               && response.indexOf("Wlheader") > -1 && response.indexOf("Wlheader2") && response.indexOf("Wlheader3")) {
      	 		return WL.App.sendActionToNative("testHeaders", statusSuccess);
			}
			else {
				var data = {"status":"testHeaders failure"};
				WL.App.sendActionToNative("testHeaders", data);
			}
          // success flow, the result can be found in response.responseJSON
      	},
      	function(error) {
      		var data = {"status":"testHeaders failure:" + getErrorDesc(error)};
			WL.App.sendActionToNative("testHeaders", data);
			console.log("testHeaders failure");
      	 
        }
 		);
	}catch(err){
		var data = {"status":"testHeaders failure:" + getErrorDesc(err)};
		WL.App.sendActionToNative("testHeaders", data);
	}
}

function pinCertificateAndGetGoogleResource(testName,certificateName){
  WL.Client.pinTrustedCertificatePublicKey(certificateName).then(function(val) {
			try{
				var request = new WLResourceRequest('https://google.com', WLResourceRequest.GET);

				request.send().then(
					function(response) {
						return WL.App.sendActionToNative(testName, statusSuccess);
					},
					function(error) {
						console.log(testName +" failure");
						var statusFailure = {"status":"Failure"};
						return WL.App.sendActionToNative(testName, statusFailure);
					}
				);
			}catch(err){
					var statusFailure = {"status":"Failed to get resource data"};
					return WL.App.sendActionToNative(testName, statusFailure);
			}
		},function(val){
			console.log(val);
			console.log("Failed calling WL.Client.pinTrustedCertificatePublicKey");
			var data = {"status":"Failed calling WL.Client.pinTrustedCertificatePublicKey"};
			WL.App.sendActionToNative(testName, data);
		});
}

function getErrorDesc(error){
  if (error.errorMsg != null){
  	return error.errorMsg;
  }else if (error.responseText != null){
  	return error.responseText;
  }else if (error.status != null){
  	return error.status;
  }else{
  	return "no available error description"
  }
}

/////////////////////// Test SDK By Eitan //////////////////////