//
//  ViewController.m
//  OpenSSLOCCocoaPodsTest
//
//  Created by Jane Singer on 16/12/2015.
//  Copyright © 2015 Jane Singer. All rights reserved.
//

#import "ViewController.h"
#import "GCDWebServer.h"
#import "GCDWebServerDataResponse.h"

@interface ViewController ()  <GCDWebServerDelegate>

@end

@implementation ViewController {
@private
    GCDWebServer* _webServer;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    NSLog(@"Initializing...");
    
    ViewController* __weak weakSelf = self;
    
    _webServer = [[GCDWebServer alloc] init];
    [_webServer addHandlerForMethod:@"GET" path:@"/OpenSSLOCCocoaPodsTest" requestClass:[GCDWebServerRequest class]
                       processBlock:^GCDWebServerResponse *(GCDWebServerRequest* request) {
                           
                           return [GCDWebServerDataResponse responseWithText:[weakSelf test]];
                           
                       }];

    [_webServer addHandlerForMethod:@"POST" path:@"/OpenSSLOCCocoaPodsTest" requestClass:[GCDWebServerRequest class]
                       processBlock:^GCDWebServerResponse *(GCDWebServerRequest* request) {
                           
                           return [GCDWebServerDataResponse responseWithText:[weakSelf test]];
                           
                       }];

    if ([_webServer startWithPort:8080 bonjourName:nil]) {
        NSLog(@"%@",[NSString stringWithFormat:NSLocalizedString(@"GCDWebServer running locally on port %i", nil), (int)_webServer.port]);
    } else {
        NSLog(NSLocalizedString(@"GCDWebServer not running!", nil));
    }
    
}

- (NSString*) test{
    
    //User provided password, hardcoded only for simplicity
    NSString* password = @"HelloPassword";
    //Random salt with recommended length
    NSString* salt = [WLSecurityUtils generateRandomStringWithBytes:32];
    //Recomended number of interations
    int interations = 10000;
    //Will be populated with an error if one occurs
    NSError* error = nil;
    [WLSecurityUtils enableOSNativeEncryption: NO];
    //Call that will generate the key
    NSString* key = [WLSecurityUtils generateKeyWithPassword:password
                                                     andSalt:salt
                                               andIterations:interations
                                                       error:&error];
    
    //Text that will be encrypted
    NSString* originalString = @"My secret text";
    
    NSDictionary* dict = [WLSecurityUtils encryptText:originalString
                                              withKey:key
                                                error:&error];
    
    [WLSecurityUtils enableOSNativeEncryption: YES];
    
    //Should return: 'My secret text'
    NSString* decryptedString = [WLSecurityUtils decryptWithKey:key
                                                  andDictionary:dict
                                                          error:&error];
    if ([decryptedString isEqualToString: originalString]) {
        NSLog(@"Test passed");
        return @"OK";
    }
    NSLog(@"Test failed");
    return @"Fail";
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
