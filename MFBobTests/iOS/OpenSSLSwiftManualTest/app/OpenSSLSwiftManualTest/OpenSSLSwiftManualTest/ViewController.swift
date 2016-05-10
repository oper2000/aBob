//

//  ViewController.swift

//  OpenSSLSwiftCocoaPodsTest

//

//  Created by Jane Singer on 23/11/2015.

//  Copyright © 2015 Jane Singer. All rights reserved.

//



import UIKit

import IBMMobileFirstPlatformFoundation

class ViewController: UIViewController {
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let server = HttpServer()
        server["/OpenSSLSwiftManualTest"] = { .OK(.STRING($0.url + "-" + self.test())) }
        server.start()
    }
    
    func test() -> String{
        var oK = false
        let pwd = "HelloPassword"
        let salt = WLSecurityUtils.generateRandomStringWithBytes(32)
        let iter = 10000
        let key = try!WLSecurityUtils .generateKeyWithPassword(pwd, andSalt: salt, andIterations: iter)
        let secret = "My secret string"
        var dict = try!WLSecurityUtils.encryptText(secret, withKey: key)
        var decryptedString = try!WLSecurityUtils.decryptWithKey(key, andDictionary: dict)
        if (decryptedString == secret) {
            oK = true
        }
        
        WLSecurityUtils.enableOSNativeEncryption(false)
        dict = try!WLSecurityUtils.encryptText(secret, withKey: key)
        WLSecurityUtils.enableOSNativeEncryption(true)
        decryptedString = try!WLSecurityUtils.decryptWithKey(key, andDictionary: dict)
        if (decryptedString == secret && oK) {
            return "OK"
        }
        return "Fail"
    }

    
    
    
    override func didReceiveMemoryWarning() {
        
        super.didReceiveMemoryWarning()
        
        // Dispose of any resources that can be recreated.
        
    }
    
    
    
    
    
}

