//
//  InterfaceController.swift
//  Watch Extension
//
//  Created by Amitai Madar on 20/01/16.
//  Copyright © 2016 Amitai Madar. All rights reserved.
//

import WatchKit
import Foundation
import IBMMobileFirstPlatformFoundationWatchOS

class AutomationInterfaceController: WKInterfaceController {
    
    var server: HttpServer
    var counter: Int = 0
    var timeout: Int = 120
    
    required override init() {
        server = HttpServer()
        super.init()
    }

    override func willActivate() {
        // This method is called when watch view controller is about to be visible to user
        super.willActivate()
        server["/"] = { request in
            var url = request.url.split("/")
            if(!url.isEmpty){
                let testResult:String = self.dispatchTest(url[0], urlParams: request.urlParams)
                return .OK(.Text(testResult));
            }
            return .OK(.Text("Failure. No test"));
        }
        do {
            try server.start(10080)
        } catch _ {}
    }

    override func didDeactivate() {
        // This method is called when watch view controller is no longer visible
        super.didDeactivate()
        server.stop()
    }
    
    func dispatchTest(testName: String ,urlParams:[(String,String)]) -> String{
        let automaticTest :AutomaticTest? = AutomaticInterpreter.getTestInstanceForName(testName);
        if(automaticTest == nil){
            return "Failure. Test does not exist"
        }
        let priority = DISPATCH_QUEUE_PRIORITY_DEFAULT
        dispatch_async(dispatch_get_global_queue(priority, 0)) {
            automaticTest!.run(urlParams)
        }
        while(GlobalVar.result.isEmpty && counter < timeout){
            ++counter;
            sleep(1);
        }
        var testResult:String = GlobalVar.result;
        if(counter>=timeout){
            testResult = "Failure. Timeout";
        }
        GlobalVar.result = "";
        counter = 0;
        return testResult;
        
    }

}
