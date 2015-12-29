package com.example.amitaim.automationapp.Tests;

import com.example.amitaim.automationapp.MainActivity;
import com.worklight.wlclient.RequestMethod;
import com.worklight.wlclient.api.WLFailResponse;
import com.worklight.wlclient.api.WLResourceRequest;
import com.worklight.wlclient.api.WLResponse;
import com.worklight.wlclient.api.WLResponseListener;

import java.net.URI;

/**

 * Created by SEitan on 12/28/15.
 */
public class PinningTest extends AutomaticTest{

    public static final String successTest = "PinningSuccess";
    public static final String failureTest = "PinningFailure";

    private String testName;
    public PinningTest(String testName) {
        this.testName = testName;
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
        MainActivity.AutomationServer.result = "Success ";
    }

//    public class MyWLResourceRequestListener implements WLObtainAccessTokenListener {
//
//        @Override
//        public void onSuccess(AccessToken accessToken) {
//            MainActivity.AutomationServer.result = "Success ";
//            return;
//        }
//
//        @Override
//        public void onFailure(WLFailResponse wlFailResponse) {
//            MainActivity.AutomationServer.result = "Failure " + wlFailResponse.getErrorMsg();
//            return;
//        }
//    }
}
