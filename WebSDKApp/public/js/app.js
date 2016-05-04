
define([
  'ibmmobilefirstplatformfoundationanalytics',
  'ibmmobilefirstplatformfoundationlogger',
  'worklight',
], function(ibmmobilefirstplatformfoundationanalytics, ibmmobilefirstplatformfoundationlogger, WL){
  
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

function login() {
	var credentials = {
			user : 'test',
			password : 'test'
	};
	WLAuthorizationManager.login('usernamePassword', credentials).then(function(){
		console.log('success logging in!');
	}, function(error){
		console.log('what?? ' + error);
	});
};

function logout() {
	WLAuthorizationManager.logout('usernamePassword').then(function(){
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
    ibmmobilefirstplatformfoundationlogger.info(msg);
    ibmmobilefirstplatformfoundationlogger.error('error', msg);
};


function send() {
    ibmmobilefirstplatformfoundationanalytics.send();
};

return {
    obtainAccessToken: obtainAccessToken,
    login: login,
    logout: logout,
    resourceRequestSecured: resourceRequestSecured,
    log: log,
    send: send
  };
});