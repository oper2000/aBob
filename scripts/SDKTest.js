
/////////////////////// Test SDK By Eitan //////////////////////
function testSDK(){
	testBase64Encode();
}

function testBase64Encode(){
		WL.SecurityUtils.base64Encode("7").then(function(val) {
  			console.log("WL.SecurityUtils.base64Encode: Success.");
  			testBase64Decode();
		},function(val){
			console.log(val);
			showTestsStatus(val.msg);
		}).fail(function(){
			  console.log("failure");
			showTestsStatus("Failed calling WL.SecurityUtils.testBase64Decode");
		});
}

function testBase64Decode(){
		WL.SecurityUtils.base64Decode("Nw==").then(function(val) {
  			console.log("WL.SecurityUtils.base64Decode: Success.");
  			if ( getEnv() ==  WL.Env.IPHONE){
  			  	testEnableOSNativeEncryption();
  			}else{
  				testEncrypt();
  			}
		},function(val){
			showTestsStatus(val.msg);
			console.log(val);
		}).fail(function(){
			showTestsStatus("Failed calling WL.SecurityUtils.testBase64Decode");
			console.log("failure");
		});
}

function testEnableOSNativeEncryption(){
		WL.SecurityUtils.enableOSNativeEncryption(true).then(function(val) {
		  	console.log("WL.SecurityUtils.base64Decode: Success.");
  			testEncrypt();
		},function(val){
			showTestsStatus(val.msg);
			console.log(val);
		}).fail(function(){
			showTestsStatus("Failed calling WL.SecurityUtils.testEnableOSNativeEncryption");
			console.log("failure");
		});
}

function testEncrypt(){
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
	if (message == "Success"){
		alert("All tests succeeded");
	}else{
		alert(" Tests failed: "+ message)
	}
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
}

function testWLClient(){
	try{
		WL.Client.getAppProperty(WL.AppProperty.APP_VERSION);
		WL.Client.getAppProperty(WL.AppProperty.MAIN_FILE_PATH);
		WL.Client.getEnvironment();
		WL.Client.getCookies().then(function(val) {
		  	console.log("WL.Client.getCookies: Success.");
		  	testResourceRequest();
		},function(val){
			showTestsStatus(val.msg);
			console.log(val);
		}).fail(function(){
			showTestsStatus("Failed calling WL.Client.getCookies");
			console.log("failure");
		});
	}catch(err){
		showTestsStatus(err.message);
	}
}


function testResourceRequest(){
	testLogger();
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
      		showTestsStatus("Success");
          // success flow, the result can be found in response.responseJSON
      	},
      	function(error) {
           showTestsStatus(error);
          // failure flow
          // the error code and description can be found in error.errorCode and error.errorMsg fields respectively
      	}
 		).fail(function(){
 			showTestsStatus("Failed calling WLResourceRequest.send");
 			console.log("failure");
 		});
	}catch(err){
		showTestsStatus(err.message);
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

}
/////////////////////// Test SDK By Eitan //////////////////////
