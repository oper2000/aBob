#!/bin/sh

TEST_ROOT=$1
APP_NAME=$2
WATCH_APP=$3
DEVICE=$4
REPORT_DIR=$5
TEST_FILE=$6
DEVICE_URL=$7
#echo $1
#echo $2
#echo $3
#echo $4
#echo $5
#echo $6
#echo $7
echo decice url: $DEVICE_URL
using_simulator="NO"
if [[ $DEVICE == *"("* ]]
then
echo "using simulator $DEVICE"
killall "Simulator"
killall "Simulator (Watch)"
using_simulator="YES"
else
echo "using device $DEVICE"
fi

source ~/.bash_profile

cd "$TEST_ROOT"
if [[ $using_simulator = "YES" ]]; then
xcrun instruments -w "$DEVICE"
sleep 15
echo "$TEST_ROOT"
if [[ "WATCH_APP" == "No" ]]; then
xcrun simctl uninstall booted "com.worklight.ibm.$APP_NAME"
xcrun simctl install booted "$APP_NAME.app"
xcrun simctl launch  booted "com.worklight.ibm.$APP_NAME"
else
xcrun simctl uninstall booted "com.worklight.ibm.$APP_NAME.watchkitapp"
xcrun simctl install booted "Watch.app"
xcrun simctl launch  booted "com.worklight.ibm.$APP_NAME.watchkitapp"
fi
else
DEVICE=$(echo ${DEVICE} | cut -d';' -f2)
echo ios device: ${DEVICE}
ios-deploy -i $DEVICE --uninstall_only --bundle_id com.worklight.ibm.$APP_NAME
ios-deploy -i $DEVICE --justlaunch --bundle $TEST_ROOT${APP_NAME}Device.app
fi
sleep 5
ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml -Dreport.dir=$REPORT_DIR -DtestFile=$TEST_FILE -DdeviceUrl=$DEVICE_URL
ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml replaceTestsName -Dreport.dir=$REPORT_DIR

if [[ $using_simulator == "NO" ]]; then
ios-deploy -i $DEVICE --uninstall_only --bundle_id com.worklight.ibm.$APP_NAME
fi

/Users/bob/Documents/Developer/Quickbuild/scripts/tearupiOStest.sh $TEST_ROOT