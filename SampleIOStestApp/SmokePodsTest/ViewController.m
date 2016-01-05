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
#import "AutomaticTest.h"

NSString *result=@"";
int counter=0;
int testTimeout=60;

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
    [_webServer addHandlerForMethod:@"GET" pathRegex:@"/*" requestClass:[GCDWebServerRequest class]
                       processBlock:^GCDWebServerResponse *(GCDWebServerRequest* request) {
                           if([request.path isEqualToString:@"/"]){
                               return [GCDWebServerDataResponse responseWithText:@"Failure. No test"];
                           }
                           return [GCDWebServerDataResponse responseWithText:[weakSelf dispatchTest:[request.path substringFromIndex:1] urlParams:request.query]];
                       }];
    
    [_webServer addHandlerForMethod:@"POST" pathRegex:@"/*" requestClass:[GCDWebServerRequest class]
                       processBlock:^GCDWebServerResponse *(GCDWebServerRequest* request) {
                           if([request.path isEqualToString:@"/"]){
                               return [GCDWebServerDataResponse responseWithText:@"Failure. No test"];
                           }
                           return [GCDWebServerDataResponse responseWithText:[weakSelf dispatchTest:[request.path substringFromIndex:1] urlParams:request.query]];
                       }];


    if ([_webServer start]) {
        NSLog(@"%@",[NSString stringWithFormat:NSLocalizedString(@"GCDWebServer running locally on port %i", nil), (int)_webServer.port]);
    } else {
        NSLog(NSLocalizedString(@"GCDWebServer not running!", nil));
    }
    
}

- (NSMutableString*) dispatchTest:(NSString*)testName urlParams:(NSDictionary*)urlParams{
    if ([testName hasSuffix:@"/"]) {
        testName=[testName substringToIndex:testName.length-1];
    }
    AutomaticTest *automaticTest = [[NSClassFromString(testName) alloc] init];
    if(automaticTest==nil){
        return [NSMutableString stringWithString: @"Failure. Test does not exist"];
    }
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [automaticTest run:urlParams];
    });
    
    while ([result isEqualToString:@""] && counter < testTimeout) {
        ++counter;
        [NSThread sleepForTimeInterval:1.0f];
    }
    
    NSMutableString* testResult=[NSMutableString stringWithString: result];
    
    if (counter>=testTimeout) {
        testResult=[NSMutableString stringWithString: @"Failure. Timeout"];
    }
    
    result=@"";
    counter=0;
    return testResult;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
