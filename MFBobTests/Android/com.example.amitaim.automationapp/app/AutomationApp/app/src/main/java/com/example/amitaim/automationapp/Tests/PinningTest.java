package com.example.amitaim.automationapp.Tests;

import com.example.amitaim.automationapp.MainActivity;
import com.worklight.wlclient.RequestMethod;
import com.worklight.wlclient.api.WLFailResponse;
import com.worklight.wlclient.api.WLResourceRequest;
import com.worklight.wlclient.api.WLResponse;
import com.worklight.wlclient.api.WLResponseListener;

import java.net.URI;

import fi.iki.elonen.NanoHTTPD;

/**

 * Created by SEitan on 12/28/15.
 */
public class PinningTest extends AutomaticTest{


    private String testName;
    private static final String successTest = "PinningSuccess";
    private static final String failureTest = "PinningFailure";


    public PinningTest(NanoHTTPD.IHTTPSession session) {
        testName = session.getParms().get("testName");
    }

    @Override
    public void run() {
        try {
            WLResourceRequest request = new WLResourceRequest(new URI("https://google.com"), RequestMethod.GET.name());
            String certName = "IBMCert.cer";
            if (testName.equals("PinningSuccess")){
                certName = "google.cer";
            }
            MainActivity.client.pinTrustedCertificatePublicKey(certName);

            request.send(new WLResponseListener() {
                @Override
                public void onSuccess(final WLResponse wlResponse) {
                    handleWLResponse(wlResponse);
                }

                @Override
                public void onFailure(final WLFailResponse wlFailResponse) {
                    handleWLResponse(wlFailResponse);
                }
            });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void handleWLResponse(WLResponse response){

        boolean testSucceeded = true;
        if (response instanceof WLFailResponse){
            if (testName.equals(successTest)){
                testSucceeded = false;
                MainActivity.AutomationServer.result = "Failure " + ((WLFailResponse) response).getErrorMsg();
                return;
            }
        }else{
            if (testName.equals(failureTest)){
                testSucceeded = false;
                MainActivity.AutomationServer.result = "Failure: using not eligible certificate should result with failure - but it did not! ";
                return;
            }
        }
        MainActivity.AutomationServer.result = "Success";
    }
}
