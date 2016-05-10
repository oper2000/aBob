
define([
  'ibmmfpfanalytics',
  'ibmmfpflogger',
  'worklight',
], function(ibmmfpfanalytics, ibmmfpflogger, WL){
  
var wlInitOptions = {'mfpContextRoot' : '/mfp' , 'applicationId' : 'com.sampleone.bankApp'};

WL.Client.init(wlInitOptions).then(function(){
		console.log('Creating challenge handler');
		createChallengeHandler();
		});

function resourceRequest() {
	var request = new WL.ResourceRequest('adapters/bankAdapterUnprotected/view/balanceGet', WL.ResourceRequest.GET);
	request.send().then(function(data){
		console.log('data: ' + JSON.stringify(data));
	})
};

function obtainAccessToken() {
	WLAuthorizationManager.obtainAccessToken().then(function(token){
	  console.log('token: ' + JSON.stringify(token));
	}, function(error){
	  console.log('what?? ' + error);
	})
};

function resourceRequestSecured() {
	var request = new WL.ResourceRequest('adapters/account/balance', WL.ResourceRequest.GET);

	var sampleAppRealmChallengeHandler = WL.Client.createWLChallengeHandler("UserLogin");

	sampleAppRealmChallengeHandler.handleChallenge = function(challenge) {
		console.log("handleChallenge :: authenticationRequired :: " + challenge.authenticationRequired);

		if (challenge.authenticationRequired === true){

			if (challenge.message){
				console.log(challenge.message);
			}
		}
		var credentials = {
				username : "a",
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

	request.send().then(function(data){
		console.log('data: ' + JSON.stringify(data));
	})
}; 

function login(user) {
	ibmmfpfanalytics.setUserContext(user)
	var credentials = {
				username : "Michael",
				password : "Michael"
			};
	WLAuthorizationManager.login('UserLogin', credentials).then(function(){
		console.log('success logging in!');
	}, function(error){
		console.log('what?? ' + error);
	});
};

function logout() {
	WLAuthorizationManager.logout('UserLogin').then(function(){
		console.log('success logging out!');
	}, function(error){
		console.log('what?? ' + error);
	});
};

function createChallengeHandler() {
	var challengeHandler = WL.Client.createWLChallengeHandler('usernamePassword');

	challengeHandler.handleChallenge = function(challenge) {
		console.log("handleChallenge :: authenticationRequired :: " + challenge.authenticationRequired);


		if (challenge.authenticationRequired === true){
				submitUsernamePasswordChallenge(challengeHandler);
					if (challenge.message){
							console.log(challenge.message);
					}
			}
	};

	challengeHandler.processSuccess = function (data){
			console.log('handle success' + JSON.stringify(data));
	}

	challengeHandler.handleFailure = function (data){
		console.log('handle failure: ' + JSON.stringify(data));
	}
};

function submitUsernamePasswordChallenge(challengeHandler) {
    var credentials = {
        user : 'test',
        password : 'test'
    };
    challengeHandler.submitChallengeAnswer(credentials);
};

function log(msg) {
    ibmmfpflogger.info(msg);
    ibmmfpflogger.error('error', msg);
};


function send() {
    ibmmfpfanalytics.send();
};

function addCustomEvent(customEventLog) {
	ibmmfpfanalytics.addEvent({'WebPurchases':customEventLog});
};
function addCustomEventFlow(target) {
	ibmmfpfanalytics.addEvent({'src':'Landing  Page', 'target' : target});
};

function updateConfigFromServer() {
    ibmmfpflogger.updateConfigFromServer();
};

function resetConfig() {
    ibmmfpflogger.__resetState();
};
function logWithPackage(){
	//get the package get the level.	
	var pkg = document.getElementById('selectedPackage').value;
	var level = document.getElementById('selectedLevel').value;
	var msg = document.getElementById('input_for_log').value;

	var logger = ibmmfpflogger.create(pkg);
	switch(level) {
    case 'trace':
    	logger.trace(msg);
        break;
    case 'debug':
    	logger.debug(msg);
        break;
    case 'log':
    	logger.log(msg);
        break;
    case 'info':
    	logger.info(msg);
        break;
    case 'warn':
    	logger.warn(msg);
        break;
    case 'error':
    	logger.error(msg);
        break;
    case 'fatal':
    	logger.fatal(msg);
        break;                    
	}
}

function crashMe(){
	throw new Error("it's over 9000!!!");
}

return {
    obtainAccessToken: obtainAccessToken,
    login: login,
    logout: logout,
    resourceRequestSecured: resourceRequestSecured,
    log: log,
    send: send,
    addCustomEvent: addCustomEvent,
    addCustomEventFlow: addCustomEventFlow,
    updateConfig:updateConfigFromServer,
    resetConfig:resetConfig,
    logWithPackage:logWithPackage,
    crashMe : crashMe
  };
});