//
//  AutomaticTest.m
//  SmokePodsTest
//
//  Created by ibob on 04/01/2016.
//  Copyright © 2016 ibob. All rights reserved.
//

#import "AutomaticTest.h"

@implementation AutomaticTest

-(void)run:(NSDictionary *) urlParams{
    [NSException raise:NSInternalInconsistencyException
                format:@"You must override %@ in a subclass", NSStringFromSelector(_cmd)];
}
@end