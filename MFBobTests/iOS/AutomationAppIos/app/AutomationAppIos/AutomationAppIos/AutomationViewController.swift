//
//  ViewController.swift
//  AutomationAppIos
//
//  Created by Amitai Madar on 08/12/15.
//  Copyright © 2015 Amitai Madar. All rights reserved.
//

import UIKit
import IBMMobileFirstPlatformFoundation

class AutomationViewController: UIViewController {

    var server : HttpServer
    var counter: Int = 0
    var timeout: Int = 120
    
    required init?(coder aDecoder: NSCoder) {
        server = HttpServer()
        super.init(coder: aDecoder)
        
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        server["/"] = { request in
            var url = request.url.split("/")
            if(!url.isEmpty){
                let testResult:String = self.dispatchTest(url[0], urlParams: request.urlParams)
                return .OK(.Text(testResult));
            }
            return .OK(.Text("Failure. No test"));
        }
        do {
            try server.start(8080)
        } catch _ {}
    }
    
    override func viewDidDisappear(animated: Bool){
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

