package com.example.amitaim.automationapp;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.text.method.LinkMovementMethod;
import android.text.util.Linkify;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import com.example.amitaim.automationapp.Tests.AutomaticTest;
import com.worklight.common.WLConfig;
import com.worklight.wlclient.api.WLClient;

import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;

import fi.iki.elonen.NanoHTTPD;
import fi.iki.elonen.util.ServerRunner;


public class MainActivity extends AppCompatActivity {

    public AutomationServer server;

    public static WLClient client;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        client = WLClient.createInstance(this);
        WLConfig.getInstance().writeWLPref("legacy_http", "false");// not sure this is still needed
        if (server == null){
            try {
                server = new AutomationServer();
                server.start();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        setContentView(R.layout.activity_main);
        TableLayout layout1 = (TableLayout) findViewById(R.id.tableItemId);

        int counter = 0;
        Scanner read = null;
        try {
            InputStream input = getAssets().open("testSuite.txt");
            read = new Scanner(input);
        } catch (IOException e) {
            e.printStackTrace();
        }

        String testName, url, expectedResult;

        while (read.hasNextLine())
        {
            String[] values = read.nextLine().split(";");
            url = values[1];
            expectedResult = values[2];
            TableRow row= new TableRow(this);
            TextView tv = new TextView(this);
            tv.setText("http://127.0.0.1:10080/" + url  + "   "+expectedResult.split(" ")[0]);
            tv.setAutoLinkMask(Linkify.ALL);
            tv.setMovementMethod(LinkMovementMethod.getInstance());
            row.addView(tv);
            layout1.addView(row,counter++);
        }

//
//
//
//
//        for (TestUtils.Tests test: TestUtils.Tests.values()) {
//
//        }
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
