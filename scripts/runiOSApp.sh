#!/bin/sh
DEVICE="iPhone 6 (9.2) [2E1B5604-DF1E-446F-A982-69BB878CA03D]"
#DEVICE="iPhone 6 (9.1) [8E912DB2-478F-49D4-8BA5-88DE01DAC0A0]"
#SDK="iphonesimulator9.1"
DESTINATION='platform=iOS Simulator,name=iPhone 6,OS=latest'
SDK="iphonesimulator9.2"
TEST_ROOT=$1
APP_NAME=$2
#echo $APP_NAME
#echo "$TEST_ROOT$APP_NAME.app"
#echo "com.worklight.ibm.$APP_NAME"

cd "$TEST_ROOT"
if [ -d "$APP_NAME.xcworkspace" ]; then
	echo "$APP_NAME.xcworkspace found"
	xcodebuild OTHER_CFLAGS="-fembed-bitcode" -workspace $APP_NAME.xcworkspace  -scheme $APP_NAME -sdk $SDK -configuration Debug clean build CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO -destination "$DESTINATION" CONFIGURATION_BUILD_DIR="$TEST_ROOT"
else
	echo "$APP_NAME.xcworkspace not found"
	xcodebuild OTHER_CFLAGS="-fembed-bitcode" -target $APP_NAME.xcodeproj       -scheme $APP_NAME -sdk $SDK -configuration Debug clean build CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO -destination "$DESTINATION" CONFIGURATION_BUILD_DIR="$TEST_ROOT"
fi
xcrun instruments -w "$DEVICE" #-t "Network"
xcrun simctl uninstall booted $APP_NAME
xcrun simctl install booted "$TEST_ROOT$APP_NAME.app"
xcrun simctl launch  booted "com.worklight.ibm.$APP_NAME"