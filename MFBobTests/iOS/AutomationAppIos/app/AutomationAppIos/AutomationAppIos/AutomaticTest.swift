//
//  AutomaticTest.swift
//  AutomationAppIos
//
//  Created by Amitai Madar on 10/12/15.
//  Copyright © 2015 Amitai Madar. All rights reserved.
//

import Foundation

class AutomaticTest:NSObject {
    
    internal  func run(urlParams :[(String, String)]){
        assert(false, "This method must be overriden by the subclass")
    }
}