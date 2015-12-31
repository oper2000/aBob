package com.example.amitaim.automationapp.Tests;


import com.example.amitaim.automationapp.AndroidChallengeHandler;
import com.example.amitaim.automationapp.MainActivity;
import com.worklight.wlclient.auth.AccessToken;
import com.worklight.wlclient.auth.WLAuthorizationManagerInternal;
import com.worklight.wlclient.api.WLAuthorizationManager;
import com.worklight.wlclient.api.WLFailResponse;
import com.worklight.wlclient.api.WLResourceRequest;
import com.worklight.wlclient.api.WLResponse;
import com.worklight.wlclient.api.WLResponseListener;

import java.net.URI;

import fi.iki.elonen.NanoHTTPD;

/**
 * Created by amitaim on 07/12/15.
 */
public class GetRessourcesTest extends AutomaticTest {

    private String scope;
    private String userName;
    private String password;
    private String realm = "usernamePassword";
    private String path;

    public GetRessourcesTest(NanoHTTPD.IHTTPSession session) {
        scope = session.getParms().get("scope");
        path = session.getParms().get("adapterPath");
        userName = session.getParms().get("userName");
        password = session.getParms().get("password");
    }

    @Override
    public void run() {
        AndroidChallengeHandler challengeHandler = new AndroidChallengeHandler(realm,userName,password);
        MainActivity.client.registerChallengeHandler(challengeHandler);
        try {
            URI adapterPath;
            if(path == null)
                adapterPath = new URI("/adapters/account/balance");
            else
                adapterPath = new URI(path);
            //Create WLResourceRequest object. Choose the HTTP Method (GET, POST, etc).
            WLResourceRequest request = scope == null ? new WLResourceRequest(adapterPath, WLResourceRequest.GET) : new WLResourceRequest(adapterPath, WLResourceRequest.GET, scope);
            request.send(new MyResponseListener());
        }catch (Exception e){
            MainActivity.AutomationServer.result = "Failure " + e.getMessage();
            return;
        }
    }

    public class MyResponseListener implements WLResponseListener {

        @Override
        public void onSuccess(WLResponse response) {
            MainActivity.AutomationServer.result = "Success";
            WLAuthorizationManagerInternal.getInstance().clearRegistration();
            return;
        }

        @Override
        public void onFailure(WLFailResponse response) {
            String errorMsg=response.getErrorMsg();
            errorMsg=errorMsg.replace("\n","").replace("\r","").replace("\t","");
            MainActivity.AutomationServer.result = "Failure " + errorMsg;
            WLAuthorizationManagerInternal.getInstance().clearRegistration();
            return;
        }
    }
}
