package com.example.amitaim.automationapp.Tests;


import com.example.amitaim.automationapp.AndroidChallengeHandler;
import com.example.amitaim.automationapp.MainActivity;
import com.worklight.common.WLConfig;
import com.worklight.wlclient.AccessToken;
import com.worklight.wlclient.WLAuthorizationManagerInternal;
import com.worklight.wlclient.api.WLAuthorizationManager;
import com.worklight.wlclient.api.WLClient;
import com.worklight.wlclient.api.WLFailResponse;
import com.worklight.wlclient.api.WLAccessTokenListener;

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

    public class MyObtainAuthorizationHeaderListener implements WLAccessTokenListener {

        @Override
        public void onSuccess(AccessToken accessToken) {
            MainActivity.AutomationServer.result = "Success ";
            WLAuthorizationManagerInternal.getInstance().clearRegistration();
            return;
        }

        @Override
        public void onFailure(WLFailResponse wlFailResponse) {
            String errorMsg=wlFailResponse.getErrorMsg();
            errorMsg=errorMsg.replace("\n","").replace("\r","").replace("\t","");
            MainActivity.AutomationServer.result = "Failure " + errorMsg;
            //WLAuthorizationManagerInternal.getInstance().clearRegistration();
            return;
        }
    }
}
