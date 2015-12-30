package com.example.amitaim.automationapp;

import com.example.amitaim.automationapp.Tests.AutomaticTest;

import fi.iki.elonen.NanoHTTPD;

/**
 * Created by amitaim on 07/12/15.
 */
public class AutomationInterpreter {

    //return a test instance given its name
    // you need to add each new test into this switch
    public static AutomaticTest getTestInstanceForName(NanoHTTPD.IHTTPSession session){

        String testName = AutomaticTest.class.getPackage().getName() + "."+ session.getUri().replace("/","");
        AutomaticTest test;

        try {
            test = (AutomaticTest) Class.forName(testName).getConstructor(NanoHTTPD.IHTTPSession.class).newInstance(session);
        } catch (ReflectiveOperationException e) {
            return null;
        }
        return test;
    }
}
