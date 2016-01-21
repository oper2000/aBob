package com.example.amitaim.automationapp.Tests;


import com.example.amitaim.automationapp.AndroidChallengeHandler;
import com.example.amitaim.automationapp.MainActivity;
import com.worklight.wlclient.api.WLFailResponse;
import com.worklight.wlclient.api.WLResourceRequest;
import com.worklight.wlclient.api.WLResponse;
import com.worklight.wlclient.api.WLResponseListener;
import com.worklight.wlclient.auth.WLAuthorizationManagerInternal;

import org.json.JSONObject;

import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import fi.iki.elonen.NanoHTTPD;

/**
 * Created by amitaim on 03/01/16.
 */
public class SendHeadersTest extends AutomaticTest {

    private String type; //string; hash; json; byte; error
    JSONObject testJson = new JSONObject();
    byte[] testBytes;

    public SendHeadersTest() {
        type = "string";
    }

    public SendHeadersTest(NanoHTTPD.IHTTPSession session) {
        type = session.getParms().get("type");
    }

    @Override
    public void run() {
        try {
            URI adapterPath ;
            adapterPath = new URI("http://httpbin.org/headers");
            WLResourceRequest request = new WLResourceRequest(adapterPath, WLResourceRequest.GET);

            switch (type){
                case "setHeaders":
                    List<String> headersVals = new ArrayList<String>();
                    headersVals.add("header1");
                    headersVals.add("header2");
                    HashMap<String, List<String>> headers = new HashMap<String, List<String>>();
                    headers.put("testheader", headersVals);
                    request.setHeaders(headers);
                    break;
                case "addHeader":
                    request.addHeader("Testheader1", "header1");
                    request.addHeader("Testheader2", "header2");
                    break;
                case "addSameHeader":
                    request.addHeader("Testheader1", "header1");
                    request.addHeader("Testheader1", "header2");
                    break;
                case "removeHeaders":
                    request.addHeader("Testheader1", "header1");
                    request.addHeader("Testheader2", "header2");
                    request.removeHeaders("Testheader2");
                    break;
                case "getAllHeaders":
                    request.addHeader("Testheader1", "header1");
                    request.addHeader("Testheader2", "header2");
                    Map<String, List<String>> headerMap =  request.getAllHeaders();
                    int count  = 0;
                    for (Map.Entry<String, List<String>> e : headerMap.entrySet()) {
                        if (e.getKey().equals("Testheader1")) count ++;
                        if (e.getKey().equals("Testheader2")) count ++;
                        for (String headerValue : e.getValue()) {
                            if (headerValue.equals("header1")) count ++;
                            if (headerValue.equals("header2")) count ++;
                        }
                    }
                    if (count == 4) {
                        MainActivity.AutomationServer.result = "Success";
                    }
                    else {
                        MainActivity.AutomationServer.result = "Failure: missing header";
                    }
                    break;
                case "getHeaders":
                    request.addHeader("Testheader1", "header1");
                    request.addHeader("Testheader1", "header2");
                    List<String> headerList =  request.getHeaders("Testheader1");
                    count  = 0;
                    for (int i = 0; i < headerList.size(); i++) {
                        String headerVal =  headerList.get(i);
                        if (headerVal.equals("header1")) count ++;
                        if (headerVal.equals("header2")) count ++;

                    }
                    if (count == 2) {
                        MainActivity.AutomationServer.result = "Success";
                    }
                    else {
                        MainActivity.AutomationServer.result = "Failure: missing header";
                    }
                    break;
                default:
                    MainActivity.AutomationServer.result = "Failure, no such type! ";
                    return;
            }
            request.send(new MyResponseListener());

        }catch (Exception e){
            MainActivity.AutomationServer.result = "Failure " + e.getMessage();
            return;
        }
    }

    public class MyResponseListener implements WLResponseListener {

        @Override
        public void onSuccess(WLResponse response) {
            if(type.equals("setHeaders")) {
                if (response.getResponseText().contains("Testheader") &&
                        response.getResponseText().contains("header1") &&
                        response.getResponseText().contains("header2")) {
                    MainActivity.AutomationServer.result = "Success";
                }
            }
            else if(type.equals("addHeader")) {
                if (response.getResponseText().contains("Testheader1") &&
                        response.getResponseText().contains("Testheader2") &&
                        response.getResponseText().contains("header1") &&
                        response.getResponseText().contains("header2")) {
                    MainActivity.AutomationServer.result = "Success";
                }
            }
            else if(type.equals("addSameHeader")) {
                if (response.getResponseText().contains("Testheader1") &&
                        response.getResponseText().contains("header1") &&
                        response.getResponseText().contains("header2")) {
                    MainActivity.AutomationServer.result = "Success";
                }
            }
            else if (type.equals("removeHeaders")) {
                if (response.getResponseText().contains("Testheader1") &&
                        response.getResponseText().contains("header1")) {
                    MainActivity.AutomationServer.result = "Success";
                }
            }
            else if (type.equals("getHeaders") || type.equals("getAllHeaders")) {
                //ok
            }
            else
                MainActivity.AutomationServer.result = "Failure: send is different from received";
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
