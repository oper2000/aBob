package com.example.amitaim.automationapp.Tests;

import com.example.amitaim.automationapp.MainActivity;

import fi.iki.elonen.NanoHTTPD;

/**
 * Created by amitaim on 07/12/15.
 */

/* all tests inherit from automatic test.
* They are running on another thread.
* They MUST update the MainActivity.AutomationServer.result when they finish.
* */
public  class AutomaticTest101 extends AutomaticTest {

    public AutomaticTest101(NanoHTTPD.IHTTPSession session){

    }
    
    public void run() {
        MainActivity.AutomationServer.result = "101";
    }
}
