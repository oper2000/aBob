//
//  SendRequestsTest.swift
//  AutomationAppIos
//
//  Created by Amitai Madar on 09/03/16.
//  Copyright © 2016 Amitai Madar. All rights reserved.
//

import Foundation
#if WATCH
    import IBMMobileFirstPlatformFoundationWatchOS
#endif
#if PHONE
    import IBMMobileFirstPlatformFoundation
#endif


 class SendRequestsTest : AutomaticTest {
    
    var scope:String? = "";
    var userName:String? = "";
    var password:String? = "";
    var realm = "UserLogin";
    var method = "POST";
    var type:String? = "empty"; //string; hash; json; byte; error
    var testString = "Testing this string";
    var testJson:[NSObject : AnyObject]!;
    var testBytes:NSData?;
    
    override init() {
        super.init()
        testJson = ["testString":testString];
        testBytes = testString.dataUsingEncoding(NSUTF8StringEncoding)
    }
   internal override func run(urlParams :[(String, String)]) {
    let dictParams :NSMutableDictionary =  NSMutableDictionary()
    for (_, value) in urlParams.enumerate() {
        dictParams.setValue(value.1 as String, forKey: value.0 as String)
    }
    type = dictParams.valueForKey("type") as? String
    scope = dictParams.valueForKey("scope") as? String
    userName = dictParams.valueForKey("user") as? String
    password = dictParams.valueForKey("password") as? String
    if let paramMethod = dictParams.valueForKey("method") as? String{
        method = paramMethod
    }
    let challengeHandler =  IOSChallengeHandler(user: userName, pass :password,realm:realm)
    
        var adapterPath:NSURL? ;
        WLClient.sharedInstance().registerChallengeHandler(challengeHandler)
    
            switch (type!){
            case "empty" , "emptyssl":
                var _method = self.method;
                if (self.method == "head" || self.method == "options" || self.method == "OPTIONS" || self.method == "trace"){
                    _method = "get";
                }
                if(type == "emptyssl"){
                    adapterPath = NSURL(string: "https://httpbin.org/" + _method + "?testParam=param");
                }else{
                    adapterPath = NSURL(string: "http://httpbin.org/" + _method + "?testParam=param");
                }
                break;
            case "string":
                adapterPath = NSURL(string: "/adapters/testSend/users/testRequestString");
                break;
            case "hash":
                adapterPath = NSURL(string: "/adapters/testSend/users/testRequestHash");
                break;
            case "json":
                adapterPath = NSURL(string: "/adapters/testSend/users/testRequestJson");
                break;
            case "byte":
                 adapterPath = NSURL(string: "/adapters/testSend/users/testRequestByte");
                break;
            case "error":
                 adapterPath = NSURL(string: "/adapters/testSend/users/errorPath");
                break;
            default:
                GlobalVar.result = "Failure, no such type! ";
                return;
            }
            var request : WLResourceRequest
            if(scope != nil){
                request = WLResourceRequest(URL: adapterPath!, method: method,scope: scope)
            }
            else{
                request = WLResourceRequest(URL: adapterPath!, method: method)
            }
            switch (type!){

            case "string":
                if (testString == "setget"){
                    request.timeoutInterval = 40000;
                    request.queryParameters = ["testString": "setget"];
                }
                request.sendWithBody(testString, completionHandler: completionHandler)
                break;
            case"error":
                request.sendWithBody(testString, completionHandler: completionHandler)
                break;
            case "hash":
                let testHash = ["testString":testString]
                request.sendWithFormParameters(testHash, completionHandler:completionHandler);
                break;
            case "json":
                request.sendWithJSON(testJson, completionHandler: completionHandler)
                break;
            case "byte":
                request.sendWithData(testBytes, completionHandler: completionHandler)
                break;
            case "empty", "emptyssl":
                request.sendWithCompletionHandler(completionHandler);
                break;
            default:
                break;
            }
    }
    
    
    internal func completionHandler(response:WLResponse!, error:NSError!) {
        if((error) != nil){
            GlobalVar.result = "Failure" + GlobalVar.gettErrorMessage(error)
        }
        else{
            if(type == "byte"  && response.responseData == testBytes){
                GlobalVar.result = "Success"
            }
            else if(type == "json" && response.getResponseJson().description == testJson.description){
                GlobalVar.result = "Success"
            }
            else if(type == "empty" || type == "emptyssl"  && (response.responseText.containsString(method) || response.status == 200)){
                GlobalVar.result = "Success"
            }
            else if (response.responseText == testString){
                GlobalVar.result = "Success"
            }
            else{
                GlobalVar.result = "Failure: send is different from received"
            }
            
        }
        WLClient.sharedInstance().setServerUrl( WLClient.sharedInstance().serverUrl())
    }
    
}