//
//  GetTokenTest.swift
//  AutomationAppIos
//
//  Created by Amitai Madar on 10/12/15.
//  Copyright © 2015 Amitai Madar. All rights reserved.
//

import Foundation
#if WATCH
    import IBMMobileFirstPlatformFoundationWatchOS
#endif
#if PHONE
    import IBMMobileFirstPlatformFoundation
#endif



class GetRessourcesTest : AutomaticTest, NSURLSessionDataDelegate{
    
    let realm = "UserLogin";
    
    internal  override func run(urlParams :[(String, String)]){
        let dictParams :NSMutableDictionary =  NSMutableDictionary()
        for (_, value) in urlParams.enumerate() {
            dictParams.setValue(value.1 as String, forKey: value.0 as String)
        }
        let type:String? = dictParams.valueForKey("type") as? String
        let scope:String? = dictParams.valueForKey("scope") as? String
        let user:String? = dictParams.valueForKey("user") as? String
        let password:String? = dictParams.valueForKey("password") as? String
        let challengeHandler =  IOSChallengeHandler(user: user, pass :password,realm:realm)
        
        WLClient.sharedInstance().registerChallengeHandler(challengeHandler)
        let address : String = "/adapters/account/balance";
        let url : NSURL = NSURL(string: address)!
        
        var request : WLResourceRequest
        if(scope != nil){
            request = WLResourceRequest(URL: url, method: WLHttpMethodGet,scope: scope)
        }
        else{
            request = WLResourceRequest(URL: url, method: WLHttpMethodGet)
        }
        
        if(type == "handler"){
            request.sendWithCompletionHandler { (response:WLResponse!, error:NSError!) -> Void in
                if((error) != nil){
                    GlobalVar.result = "Failure" + GlobalVar.gettErrorMessage(error)
                }
                else{
                    GlobalVar.result = "Success"
                }
                WLClient.sharedInstance().setServerUrl( WLClient.sharedInstance().serverUrl())
            }
        }
        else if( type == "delegate"){
            request.sendWithDelegate(self)
        }
        else{
            GlobalVar.result = "Failure, no such type! "
        }
    }
    
    internal func URLSession(session: NSURLSession, dataTask: NSURLSessionDataTask, didReceiveResponse response: NSURLResponse, completionHandler: (NSURLSessionResponseDisposition) -> Void){
        
        completionHandler(NSURLSessionResponseDisposition.Allow)
    }
    internal func URLSession(session: NSURLSession, dataTask: NSURLSessionDataTask, didReceiveData data: NSData){
        NSLog("request", "data");
        GlobalVar.result = "Success"

        WLClient.sharedInstance().setServerUrl( WLClient.sharedInstance().serverUrl())
        //WLAuthorizationManager.sharedInstance().logout(self.realm, withCompletionHandler: {(error:NSError!) -> Void in})
    }
    internal func URLSession(session: NSURLSession, task: NSURLSessionTask, didCompleteWithError error: NSError?){
        
        GlobalVar.result = "Failure" + GlobalVar.gettErrorMessage(error!)
        WLClient.sharedInstance().setServerUrl( WLClient.sharedInstance().serverUrl())
        //WLAuthorizationManager.sharedInstance().logout(self.realm, withCompletionHandler: {(error:NSError!) -> Void in})
    }
    
}