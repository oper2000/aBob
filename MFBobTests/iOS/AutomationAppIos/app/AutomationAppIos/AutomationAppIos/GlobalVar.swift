//
//  GlobalVar.swift
//  AutomationAppIos
//
//  Created by Amitai Madar on 24/01/16.
//  Copyright © 2016 Amitai Madar. All rights reserved.
//

import Foundation

class GlobalVar {
    
    internal static var result : String = ""
    
    internal static func gettErrorMessage(error:NSError) -> String{
        var errorMsg:String = error.localizedDescription.stringByReplacingOccurrencesOfString("\n",withString: "").stringByReplacingOccurrencesOfString("\r",withString: "").stringByReplacingOccurrencesOfString("\t",withString: "");
        errorMsg = errorMsg.split(",")[0]
        return errorMsg
    }
}