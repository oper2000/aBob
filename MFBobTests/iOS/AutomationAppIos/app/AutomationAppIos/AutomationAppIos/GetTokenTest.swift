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

class GetTokenTest :AutomaticTest {
    
    internal  override func run(urlParams :[(String, String)]){
        
        let dictParams :NSMutableDictionary =  NSMutableDictionary()
        for (_, value) in urlParams.enumerate() {
            dictParams.setValue(value.1 as String, forKey: value.0 as String)
        }
        var scope:String? = dictParams.valueForKey("scope") as? String
        if(scope != nil){
            let user:String? = dictParams.valueForKey("user") as? String
            let password:String? = dictParams.valueForKey("password") as? String
            let challengeHandler =  IOSChallengeHandler(user: user, pass :password,realm:scope)
            
            WLClient.sharedInstance().registerChallengeHandler(challengeHandler)
        }
        else{
            scope = ""
        }
        
        
        WLAuthorizationManager.sharedInstance().obtainAccessTokenForScope( scope, withCompletionHandler:{ accessToken, error in
                if(error == nil){
                    GlobalVar.result = "Success"
                }
                else{
                    GlobalVar.result = "Failure" + GlobalVar.gettErrorMessage(error)
                }
             WLClient.sharedInstance().setServerUrl( WLClient.sharedInstance().serverUrl())
        })
    }
    
}