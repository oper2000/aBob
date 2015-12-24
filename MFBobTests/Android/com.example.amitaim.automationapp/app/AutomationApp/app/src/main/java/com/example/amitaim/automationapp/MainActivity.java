package com.example.amitaim.automationapp;

import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.View;
import android.view.Menu;
import android.view.MenuItem;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.logging.Logger;

import android.app.Activity;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.os.Handler;
import android.widget.TextView;

import com.example.amitaim.automationapp.Tests.AutomaticTest;
import com.worklight.common.WLConfig;
import com.worklight.wlclient.api.WLClient;

import fi.iki.elonen.NanoHTTPD;
import fi.iki.elonen.NanoHTTPD.Response;
import fi.iki.elonen.util.ServerRunner;


public class MainActivity extends AppCompatActivity {

    public AutomationServer server;

    public static WLClient client;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    @Override
    protected void onStart() {
        super.onStart();
        client = WLClient.createInstance(this);
        WLConfig.getInstance().writeWLPref("legacy_http", "false");// not sure this is still needed
        try {
            server = new AutomationServer();
            server.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
        if (server != null)
            server.stop();
    }

    public static class AutomationServer extends NanoHTTPD {

        public static void main(String[] args) {
            ServerRunner.run(AutomationServer.class);
        }
        public static String result = "";
        private int counter =0;
        private int timeout = 60;


        public AutomationServer() {
            // set port here
            super(10080);
        }

        @Override
        public Response serve(IHTTPSession session) {
            //get the right test by name
            AutomaticTest automaticTest = AutomationInterpreter.getTestInstanceForName(session);
            if(automaticTest == null){
                return newFixedLengthResponse("Failure. Test doest not exist");
            }
            // run the test on another thread and sleep until it finish/ timeout
            Thread t = new Thread(automaticTest);
            t.start();
            while(result.equals("") && counter < timeout){
                ++counter;
                try {
                    Thread.currentThread().sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            String testResult = result;
            if(counter >= timeout){
                testResult = "Failure. Timeout";
            }
            result = "";
            counter = 0;
            return newFixedLengthResponse(testResult);
        }

    }
}
