package com.example.amitaim.automationapp.Tests;

import com.example.amitaim.automationapp.MainActivity;
import com.worklight.wlclient.api.WLClient;
import com.worklight.wlclient.api.WLFailResponse;
import com.worklight.wlclient.api.WLProcedureInvocationData;
import com.worklight.wlclient.api.WLRequestOptions;
import com.worklight.wlclient.api.WLResponse;
import com.worklight.wlclient.api.WLResponseListener;
import com.worklight.wlclient.auth.WLAuthorizationManagerInternal;

import java.util.Arrays;

import fi.iki.elonen.NanoHTTPD;

/**
 * Created by amitaim on 07/12/15.
 */

/* all tests inherit from automatic test.
* They are running on another thread.
* They MUST update the MainActivity.AutomationServer.result when they finish.
* */
public  class InvokeAdapterTest extends AutomaticTest {

    public InvokeAdapterTest(NanoHTTPD.IHTTPSession session){

    }
    
    public void run() {
        WLProcedureInvocationData invocationData = new WLProcedureInvocationData("testInvoke", "hello", false);
        Object[] parameters = new Object[] {"AutoPages/CSSTest1.ht", "m", "l"};
        invocationData.setParameters(parameters);
        WLRequestOptions options = new WLRequestOptions();
        options.setTimeout(30000);
        WLClient client = WLClient.getInstance();
        client.invokeProcedure(invocationData, new MyResponseListener(), options);
    }

    public class MyResponseListener implements WLResponseListener {

        @Override
        public void onSuccess(WLResponse response) {
            if(response.getResponseText().contains("hello")) {
                MainActivity.AutomationServer.result = "Success";
            }
            else {
                MainActivity.AutomationServer.result = "Failed";
            }
            WLAuthorizationManagerInternal.getInstance().clearRegistration();
            return;
        }

        @Override
        public void onFailure(WLFailResponse response) {
            String errorMsg=response.getErrorMsg();
            if (errorMsg != null)
                errorMsg=errorMsg.replace("\n","").replace("\r","").replace("\t","");
            MainActivity.AutomationServer.result = "Failure " + errorMsg;
            WLAuthorizationManagerInternal.getInstance().clearRegistration();
            return;
        }
    }
}
