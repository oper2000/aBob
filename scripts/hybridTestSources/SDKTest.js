
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

function testBase64Encode(){
		WL.SecurityUtils.base64Encode("7").then(function(val) {
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

function testBase64Decode(){
		WL.SecurityUtils.base64Decode("Nw==").then(function(val) {
  			console.log("WL.SecurityUtils.base64Decode: Success.");
  			var data = {"status":"success"};
            WL.App.sendActionToNative("testBase64Decode", statusSuccess);
		},function(val){
			console.log("Failed calling WL.SecurityUtils.testBase64Decode:" + val);
		}).fail(function(){
			console.log("Failed calling WL.SecurityUtils.testBase64Decode" );
			var data = {"status":"Failed calling WL.SecurityUtils.testBase64Decode"};
            WL.App.sendActionToNative("testBase64Decode", data);
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

function testEncrypt(){
<<<<<<< HEAD:scripts/hybridTestSources/SDKTest.js

	WL.SecurityUtils.encrypt({"key":"hh", "text":"ggg"}).then(function(val) {
		console.log(val);
			var data = {"status":"testEncrypt failure"};
			WL.App.sendActionToNative("testEncrypt", data);
	},function(val){
		if (val.msg.slice(0,13) == "ENCRYPT_ERROR"){
			console.log("WL.SecurityUtils.encrypt: Success.");
			if ( getEnv() ==  WL.Env.IPHONE){
            		testEnableOSNativeEncryption();
            }else{
            	WL.App.sendActionToNative("testEncrypt", statusSuccess);
            }
		}else{
			console.log(val);
			var data = {"status":"failure :" + val.msg};
			WL.App.sendActionToNative("testEncrypt", data);
		}
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
=======
			WL.SecurityUtils.encrypt({"key":"hh", "text":"ggg"}).then(function(val) {
  			console.log(val);
		},function(val){
			if (val.msg.slice(0,13) == "ENCRYPT_ERROR"){
				console.log("WL.SecurityUtils.encrypt: Success.");
				testWLApp();
			}else{
				console.log(val);
				showTestsStatus(val.msg);
			}
		});
}

function showTestsStatus(message){
	var statusString = "";
	if (message == "Success"){
		statusString = "All tests succeeded";
	}else{
		statusString = " Tests failed: "+ message;
	}
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
		dir.getFile("status.txt", {create:true}, function(file) {
			logOb = file;
			if(!logOb) return;
			logOb.createWriter(function(fileWriter) {
				fileWriter.write(statusString);
			}, null);
		});
	});
}

function testWLApp(){
try{
	WL.App.getServerUrl(
	function(url){
		console.log("WL.App.getServerUrl:"+url);
	},function(err){
		showTestsStatus(err.msg);
	});
	WL.App.addActionReceiver("MyReceiver", function (receivedActon){
	// process receivedAction
	});
	WL.App.removeActionReceiver("MyReceiver");
	testWLClient();
	}catch(err){
		return showTestsStatus(err.message);
	}
>>>>>>> 552d625c66e018a771c23677cef858a6fddf1bff:scripts/SDKTest.js
}

function testWLClient(){
	try{
		WL.Client.getAppProperty(WL.AppProperty.APP_VERSION);
		WL.Client.getAppProperty(WL.AppProperty.MAIN_FILE_PATH);
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


function testResourceRequest(){
	try{
		var request = new WLResourceRequest('/adapters/account/balance', WLResourceRequest.GET);
		request.setQueryParameter('params', [5, 6]);
		request.getQueryParameters();
		request.setTimeout(60000);
		if (request.getTimeout() != 60000){
			showTestsStatus("WLResourceRequest.getTimeout Error.");
		}
		request.getTimeout();
		if (request.getUrl() != "/adapters/account/balance"){
			showTestsStatus("WLResourceRequest.getUrl Error.");
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
/////////////////////// Test SDK By Eitan //////////////////////
