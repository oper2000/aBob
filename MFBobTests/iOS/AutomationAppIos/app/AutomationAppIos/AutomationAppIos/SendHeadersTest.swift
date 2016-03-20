//
//  SendHeadersTest.swift
//  AutomationAppIos
//
//  Created by Amitai Madar on 13/03/16.
//  Copyright © 2016 Amitai Madar. All rights reserved.
//

import Foundation

#if WATCH
    import IBMMobileFirstPlatformFoundationWatchOS
#endif
#if PHONE
    import IBMMobileFirstPlatformFoundation
#endif


internal class SendHeadersTest : AutomaticTest {
    
   var type:String? = "string"; //string; hash; json; byte; error
    
    internal override func run(urlParams :[(String, String)]) {
        let dictParams :NSMutableDictionary =  NSMutableDictionary()
        for (_, value) in urlParams.enumerate() {
            dictParams.setValue(value.1 as String, forKey: value.0 as String)
        }
        type = dictParams.valueForKey("type") as? String
        var adapterPath:NSURL?
        adapterPath = NSURL(string: "http://httpbin.org/headers")
        let request: WLResourceRequest = WLResourceRequest(URL: adapterPath, method: "GET");
        
        switch (type!){
            case "setHeaders":
                request.setHeaderValue("header1 , header2", forName: "testHeader")
                break;
            case "addHeader":
                request.addHeaderValue("header1", forName: "Testheader1")
                request.addHeaderValue("header2", forName: "Testheader2")
                break;
            case "addSameHeader":
                request.addHeaderValue("header1", forName: "Testh1")
                request.addHeaderValue("header2", forName: "Testh1")
                break;
            case "removeHeaders":
                request.addHeaderValue("header1", forName: "Testheader1")
                request.addHeaderValue("header2", forName: "Testheader2")
                request.removeHeadersForName("Testheader2");
                break;
            case "getAllHeaders":
                request.addHeaderValue("header1", forName: "Testheader1")
                request.addHeaderValue("header2", forName: "Testheader2")
                var headerMap =  request.headers
                var count  = 0;
                for (var i = 0; i < headerMap.count; i++) {
                    let e =  headerMap[i]
                    let key = e.valueForKey("headerName") as! String
                    if (key == ("Testheader1") || key == ("Testheader2")){
                        count++;
                    }
                    var headerList =  request.headersForName(key)
                    for (var i = 0; i < headerList.count; i++) {
                        let headerVal =  headerList[i] as! String
                        if (headerVal == "header1" || headerVal == "header2"){
                            count++
                        }
                    }
                }
                if (count == 4) {
                    GlobalVar.result = "Success";
                }
                else {
                    GlobalVar.result = "Failure: missing header";
                }
                break;
            case "getHeaders":
                request.addHeaderValue("header1", forName: "Testheader1")
                request.addHeaderValue("header2", forName: "Testheader1")
                var headerList =  request.headersForName("Testheader1")
                var count  = 0;
                for (var i = 0; i < headerList.count; i++) {
                    let headerVal =  headerList[i] as! String
                    if (headerVal == "header1" || headerVal == "header2"){
                        count++
                    }
                }
                if (count == 2) {
                    GlobalVar.result = "Success";
                }
                else {
                    GlobalVar.result = "Failure: missing header";
                }
                break;
            default:
                GlobalVar.result = "Failure, no such type! ";
                return;
            }
            request.sendWithCompletionHandler(completionHandler)
        }
    
    
    internal func completionHandler(response:WLResponse!, error:NSError!) {
        let responseText = response.responseText
        if((error) != nil){
            GlobalVar.result = "Failure" + GlobalVar.gettErrorMessage(error)
        }
        else{
            if(type == "setHeaders" && responseText.containsString("Testheader") &&
                    responseText.containsString("header1") &&
                    responseText.containsString("header2")) {
                        GlobalVar.result = "Success";
            }
            else if(type == "addHeader" && responseText.containsString("Testheader1") &&
                    responseText.containsString("Testheader2") &&
                    responseText.containsString("header1") &&
                    responseText.containsString("header2")) {
                        GlobalVar.result = "Success";
            }
            else if(type == "addSameHeader" && responseText.containsString("Testh1") &&
                    responseText.containsString("header1") &&
                    responseText.containsString("header2")) {
                        GlobalVar.result = "Success";
            }
            else if (type == "removeHeaders" && responseText.containsString("Testheader1") &&
                    responseText.containsString("header1")) {
                        GlobalVar.result = "Success";
            }
            else if (type == "getHeaders" || type == "getAllHeaders") {
                //ok
            }
            else{
                GlobalVar.result = "Failure: send is different from received"
            }
            
        }
        WLClient.sharedInstance().setServerUrl( WLClient.sharedInstance().serverUrl())
    }
}
