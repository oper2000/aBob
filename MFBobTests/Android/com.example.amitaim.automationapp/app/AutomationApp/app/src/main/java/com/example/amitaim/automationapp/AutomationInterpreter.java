package com.example.amitaim.automationapp;

import com.example.amitaim.automationapp.Tests.AutomaticTest;
import com.example.amitaim.automationapp.Tests.GetTokenTest;
import com.example.amitaim.automationapp.Tests.PinningTest;

import fi.iki.elonen.NanoHTTPD;

/**
 * Created by amitaim on 07/12/15.
 */
public class AutomationInterpreter {

    //return a test instance given its name
    // you need to add each new test into this switch
    public static AutomaticTest getTestInstanceForName(NanoHTTPD.IHTTPSession session){
        String testName = session.getUri().replace("/","");;

        switch (testName){
            case "GetToken":
                return new GetTokenTest(session);
            case "PinningFailure":
                return new PinningTest(testName);
            case "PinningSuccess":
                return new PinningTest(testName);
            default:
                return null;
        }
    }
}
