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
    
    var testRoot = "/Users/jsinger/Documents/Developer/Jenkins/iOSTests"

    override func viewDidLoad() {
        super.viewDidLoad()
        let server = HttpServer()
        server["/OpenSSLSwiftCocoaPodsTest"] = { .OK(.HTML($0.url + "-" + self.test())) }
        server["/setTestRoot"] = { .OK(.HTML(self.setRoot($0.url))) }
        

        
        server.start()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func setRoot(root: String) -> String {
        testRoot = root.substringFromIndex(root.startIndex.advancedBy(12))
        return testRoot
    }
    
    func test() -> String{
        let fileManager = NSFileManager.defaultManager();
        do {
            //try fileManager.removeItemAtPath(testRoot + "/OpenSSL/OpenSSLSwiftCocoaPodsTestPassed")
            
        } catch {
            // Error - handle if required
        }
 
        let pwd = "HelloPassword"
        let salt = WLSecurityUtils.generateRandomStringWithBytes(32)
        let iter = 10000
        WLSecurityUtils.enableOSNativeEncryption(false)
        let key = try!WLSecurityUtils .generateKeyWithPassword(pwd, andSalt: salt, andIterations: iter)
        let secret = "My secret string"
        let dict = try!WLSecurityUtils.encryptText(secret, withKey: key)
        WLSecurityUtils.enableOSNativeEncryption(true)
        let decryptedString = try!WLSecurityUtils.decryptWithKey(key, andDictionary: dict)
        if (decryptedString == secret) {
            
            //	try!fileManager.createDirectoryAtPath(testRoot + "/OpenSSL/OpenSSLSwiftCocoaPodsTestPassed", withIntermediateDirectories: false, attributes: nil)
            return "OK"
            
        }
        
        return "Fail"
        // Do any additional setup after loading the view, typically from a nib.
    }
    
}

