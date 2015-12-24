package com.example.amitaim.automationapp.Tests;

/**
 * Created by amitaim on 07/12/15.
 */

/* all tests inherit from automatic test.
* They are running on another thread.
* They MUST update the MainActivity.AutomationServer.result when they finish.
* */
public abstract class AutomaticTest implements Runnable {
    public abstract void run();
}
