//
//  AutomaticInterperter.swift
//  AutomationAppIos
//
//  Created by Amitai Madar on 10/12/15.
//  Copyright © 2015 Amitai Madar. All rights reserved.
//

import Foundation


class AutomaticInterpreter :NSObject{
    
    internal static func getTestInstanceForName(testName: String) -> AutomaticTest?{
        var target = "AutomationAppIos."
        #if WATCH
            target = "Watch_Extension."
        #endif
        var instance: AnyObject! = nil
        let classInst = NSClassFromString(target+testName) as? NSObject.Type
        if(classInst == nil){
            return nil
        }
        instance = classInst!.init() // create the instance from this class
        return instance as? AutomaticTest
    }

}
