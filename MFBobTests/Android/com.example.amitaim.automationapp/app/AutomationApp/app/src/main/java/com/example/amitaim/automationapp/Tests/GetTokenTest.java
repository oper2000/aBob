package com.example.amitaim.automationapp.Tests;


import com.example.amitaim.automationapp.AndroidChallengeHandler;
import com.example.amitaim.automationapp.MainActivity;
import com.worklight.common.WLConfig;
import com.worklight.wlclient.AccessToken;
import com.worklight.wlclient.WLAuthorizationManagerInternal;
import com.worklight.wlclient.api.WLAuthorizationManager;
import com.worklight.wlclient.api.WLClient;
import com.worklight.wlclient.api.WLFailResponse;
import com.worklight.wlclient.api.WLObtainAccessTokenListener;

import fi.iki.elonen.NanoHTTPD;

/**
 * Created by amitaim on 07/12/15.
 */
public class GetTokenTest extends AutomaticTest {

    private String scope;
    private String userName;
    private String password;
    private String realm = "usernamePassword";

    public GetTokenTest(NanoHTTPD.IHTTPSession session) {
        scope = session.getParms().get("scope");
        userName = session.getParms().get("userName");
        password = session.getParms().get("password");
    }

    @Override
    public void run() {
        if(scope != null){
            AndroidChallengeHandler challengeHandler = new AndroidChallengeHandler(realm,userName,password);
            MainActivity.client.registerChallengeHandler(challengeHandler);
        }
        WLAuthorizationManager.getInstance().obtainAccessToken(scope, new MyObtainAuthorizationHeaderListener());
    }

    public class MyObtainAuthorizationHeaderListener implements WLObtainAccessTokenListener {

        @Override
        public void onSuccess(AccessToken accessToken) {
            MainActivity.AutomationServer.result = "Success ";
            return;
        }

        @Override
        public void onFailure(WLFailResponse wlFailResponse) {
            MainActivity.AutomationServer.result = "Failure " + wlFailResponse.getErrorMsg();
            return;
        }
    }
}
