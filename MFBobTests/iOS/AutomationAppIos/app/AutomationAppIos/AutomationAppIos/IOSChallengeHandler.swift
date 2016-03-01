//
//  IOSChallengeHandler.swift
//  AutomationAppIos
//
//  Created by Amitai Madar on 14/01/16.
//  Copyright © 2016 Amitai Madar. All rights reserved.
//

import Foundation
#if WATCH
    import IBMMobileFirstPlatformFoundationWatchOS
#endif
#if PHONE
    import IBMMobileFirstPlatformFoundation
#endif


class IOSChallengeHandler : WLChallengeHandler{
    
    
    var userName :String? = ""
    var password :String? = ""
    
    
    init(user: String?, pass: String?,realm:String?){
        
        if(user != nil){
            userName = user
        }
        if(pass != nil){
            password = pass
        }
        super.init(securityCheck: realm)
    }
    
    /**
     * This method is called when the IBM MobileFirst Platform Server reports an authentication success.
     */
    internal override func handleSuccess(success: [NSObject : AnyObject]!){
        NSLog("ResourceRequest", "handleSuccess");
    }
    
    /**
     *  This method is called when the IBM MobileFirst Platform Server reports an authentication failure.
     */
    internal override func handleFailure(failure: [NSObject : AnyObject]!){
        NSLog("ResourceRequest", "handleFailure");
    }
    
    /**
     * This method is called when the IBM MobileFirst Platform Server returns a challenge for the realm.
     */
    internal override func handleChallenge(challenge: [NSObject : AnyObject]!){
        submitChallengeAnswer(["user":userName!, "password":password!]);
    }
    

}