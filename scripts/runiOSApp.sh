#!/bin/sh
DEVICE="iPhone 6 (9.2) [2E1B5604-DF1E-446F-A982-69BB878CA03D]"
DEVICE2="iPhone 6s (9.2) [8C0F087C-A26B-4AC8-9D81-DDBA8854C97A]"
WATCH="Apple Watch - 38mm (E58A6E6A-58EB-4407-B565-C0C33DB217CC)"
#DEVICE="iPhone 6 (9.1) [8E912DB2-478F-49D4-8BA5-88DE01DAC0A0]"
#SDK="iphonesimulator9.1"
DESTINATION='platform=iOS Simulator,name=iPhone 6,OS=latest'
DESTINATION2='platform=iOS Simulator,name=iPhone 6s,OS=latest'
SDK="iphonesimulator9.2"
TEST_ROOT=$1
APP_NAME=$2
#echo $APP_NAME
#echo "$TEST_ROOT$APP_NAME.app"
#echo "com.worklight.ibm.$APP_NAME"

cd "$TEST_ROOT"
if [[ "$3" == "No" ]]; then
if [ -d "$APP_NAME.xcworkspace" ]; then
	echo xcodebuild OTHER_CFLAGS="-fembed-bitcode" -workspace $APP_NAME.xcworkspace  -scheme $APP_NAME -configuration Debug clean build CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO -destination "$DESTINATION" CONFIGURATION_BUILD_DIR="$TEST_ROOT"
	xcodebuild OTHER_CFLAGS="-fembed-bitcode" -workspace $APP_NAME.xcworkspace  -scheme $APP_NAME -configuration Debug clean build CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO -destination "$DESTINATION" CONFIGURATION_BUILD_DIR="$TEST_ROOT"
else
	echo "$APP_NAME.xcworkspace not found"
	xcodebuild OTHER_CFLAGS="-fembed-bitcode" -target $APP_NAME.xcodeproj -scheme $APP_NAME -sdk $SDK -configuration Debug clean build CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO -destination "$DESTINATION" CONFIGURATION_BUILD_DIR="$TEST_ROOT"
fi
xcrun instruments -w "$DEVICE" #-t "Network"
xcrun simctl uninstall booted $APP_NAME
xcrun simctl install booted "$TEST_ROOT$APP_NAME.app"
xcrun simctl launch  booted "com.worklight.ibm.$APP_NAME"
else
echo "building watch app"
xcodebuild OTHER_CFLAGS="-fembed-bitcode" -workspace $APP_NAME.xcworkspace  -scheme Watch -configuration Debug clean build CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO -destination "$DESTINATION2" CONFIGURATION_BUILD_DIR="$TEST_ROOT"
xcrun instruments -w "$DEVICE2" #-t "Network"
xcrun instruments -w "$WATCH" #-t "Network"
xcrun simctl uninstall booted $APP_NAME
xcrun simctl install booted "$TEST_ROOT$APP_NAME.app"
xcrun simctl launch  booted "com.worklight.ibm.$APP_NAME.watchkitapp"
fi