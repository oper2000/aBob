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
import java.util.Arrays;
import java.util.LinkedHashMap;

import fi.iki.elonen.NanoHTTPD;

/**
 * Created by amitaim on 03/01/16.
 */
public class SendRequestsTest extends AutomaticTest {

    private String scope;
    private String userName;
    private String password;
    private String realm = "UserLogin";
    private String method = "post";
    private String type; //string; hash; json; byte; error
    private String testString = "Testing this string";
    JSONObject testJson = new JSONObject();
    WLResourceRequest request;
    byte[] testBytes;

    public SendRequestsTest(NanoHTTPD.IHTTPSession session) {
        scope = session.getParms().get("scope");
        userName = session.getParms().get("userName");
        password = session.getParms().get("password");
        type = session.getParms().get("type");
        testString = session.getParms().get("testString") == null ? "Testing this string" : session.getParms().get("testString");
        method = session.getParms().get("method") != null ? session.getParms().get("method")  : WLResourceRequest.POST;
    }

    @Override
    public void run() {
        AndroidChallengeHandler challengeHandler = new AndroidChallengeHandler(realm,userName,password);
        try {
            URI adapterPath ;
            if (type.startsWith("empty") || method != null) {
                String _method = method;
                if (method.equals("head")) _method = "get";
                if (method.equals("options")) _method = "get";
                if (method.equals("trace")) _method = "get";
                if (type.equals("emptyssl")) {
                    adapterPath = new URI("https://httpbin.org/" + _method + "?testParam=param");
                }
                else {
                    adapterPath = new URI("http://httpbin.org/" + _method + "?testParam=param");
                }
            }
            switch (type){
                case "empty": case "emptyssl":
                    String _method = method;
                    if (method.equals("head")) _method = "get";
                    if (method.equals("options")) _method = "get";
                    if (method.equals("trace")) _method = "get";
                    if (type.equals("emptyssl")) {
                        adapterPath = new URI("https://httpbin.org/" + _method + "?testParam=param");
                    }
                    else {
                        adapterPath = new URI("http://httpbin.org/" + _method + "?testParam=param");
                    }
                    if(scope!=null)
                        MainActivity.client.registerChallengeHandler(challengeHandler);
                    break;
                case "string":
                    MainActivity.client.registerChallengeHandler(challengeHandler);
                    adapterPath = new URI("/adapters/testSend/users/testRequestString");
                    break;
                case "hash":
                    MainActivity.client.registerChallengeHandler(challengeHandler);
                    adapterPath = new URI("/adapters/testSend/users/testRequestHash");
                    break;
                case "json":
                    MainActivity.client.registerChallengeHandler(challengeHandler);
                    adapterPath = new URI("/adapters/testSend/users/testRequestJson");
                    break;
                case "byte":
                    MainActivity.client.registerChallengeHandler(challengeHandler);
                    adapterPath = new URI("/adapters/testSend/users/testRequestByte");
                    break;
                case "error":
                    MainActivity.client.registerChallengeHandler(challengeHandler);
                    adapterPath = new URI("/adapters/testSend/users/errorPath");
                    break;
                default:
                    MainActivity.AutomationServer.result = "Failure, no such type! ";
                    return;
            }
            request = scope == null ? new WLResourceRequest(adapterPath, method) : new WLResourceRequest(adapterPath, method.toUpperCase(), scope);
            switch (type){
                case "string":
                    if (testString.equals("setget")) {
                        request.setTimeout(40000);
                        request.setQueryParameter("testString", "setget");
                    }
                case"error":
                    request.send(testString,new MyResponseListener());
                    break;
                case "hash":
                    LinkedHashMap<String,String> testHash = new LinkedHashMap<>();
                    testHash.put("testString", testString);
                    request.send(testHash,new MyResponseListener());
                    break;
                case "json":
                    testJson.put("testSting",testString);
                    request.send(testJson,new MyResponseListener());
                    break;
                case "byte":
                    testBytes =testString.getBytes("UTF-8");
                    request.send(testBytes,new MyResponseListener());
                    break;
                case "empty":case "emptyssl":
                    request.send(new MyResponseListener());
                    break;
                default:
                    break;
            }
        }catch (Exception e){
            MainActivity.AutomationServer.result = "Failure " + e.getMessage();
            return;
        }
    }

    public class MyResponseListener implements WLResponseListener {

        @Override
        public void onSuccess(WLResponse response) {
            if(type.equals("byte") && Arrays.equals(response.getResponseBytes(),testBytes) )
                MainActivity.AutomationServer.result = "Success";
            else if(type.equals("json") && response.getResponseText().equals(testJson.toString()))
                MainActivity.AutomationServer.result = "Success";
            else if(type.startsWith("empty") && (response.getResponseText().contains(method) || response.getStatus() == 200))
                MainActivity.AutomationServer.result = "Success";
            else if (response.getResponseText().equals(testString)) {
                if(testString.equals("setget")) {
                    if (request.getTimeout() == 40000 && request.getUrl().toString().contains("/mfp/api/adapters/testSend/users/testRequestString") &&
                            request.getMethod().equals(WLResourceRequest.POST) && request.getQueryString().equals("testString=setget") &&
                            request.getQueryParameters().size() == 1 && request.getQueryParameters().entrySet().toString().contains("[testString=setget]")) {
                        MainActivity.AutomationServer.result = "Success";
                    }
                    else {
                        MainActivity.AutomationServer.result = "Failure: getters differ from setters";
                    }
                }
                else {
                    MainActivity.AutomationServer.result = "Success";
                }
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
