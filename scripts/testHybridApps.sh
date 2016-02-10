#!/bin/sh

deviceURL=http://127.0.0.1:10081/
ios_deviceURL=http://127.0.0.1:8080/
PROJ_NAME=hybridProj
SCRIPTS_PATH=/Users/bob/Documents/Developer/Quickbuild/scripts
TARGET=Nexus_5_API_23_hybrid
IOS_TARGET=hybrid_IOS
device=emulator-5554

if [ ! -d $SCRIPTS_PATH ]
then
	SCRIPTS_PATH=.
fi

cd $SCRIPTS_PATH

./hybridTestSources/createHybridTestProj.sh $PROJ_NAME

cd $PROJ_NAME

appName=io.cordova.hellocordova
REPORT_NAME=$TARGET

/Users/bob/Library/Android/sdk/tools/emulator -avd $TARGET -netspeed full -netdelay none  &

output=''
while [[ ${output:0:7} != 'stopped' ]]; do
  output=`adb shell getprop init.svc.bootanim`
  sleep 5
done

echo "emulator is up"

adb -s $device uninstall $appName 
echo "echo adb -s $device install /Users/bob/Documents/Developer/Quickbuild/scripts/hybridProj/platforms/android/build/outputs/apk/android-x86-debug.apk"
adb -s $device install /Users/bob/Documents/Developer/Quickbuild/scripts/hybridProj/platforms/android/build/outputs/apk/android-x86-debug.apk

adb -s $device forward tcp:10081 tcp:10080

adb -s $device shell am start -n "$appName/$appName.MainActivity" -a android.intent.action.MAIN -c android.intent.category.LAUNCHER
mkdir /Users/bob/Documents/Developer/Quickbuild/Reports/latest/$TARGET/
adb -s $device logcat > /Users/bob/Documents/Developer/Quickbuild/Reports/latest/$TARGET.logcat.log & PID=$!

sleep 10

ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/$TARGET -DtestFile $SCRIPTS_PATH/hybridTestSources/hybridTestSuite.txt -DdeviceUrl $deviceURL
ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml replaceTestsName -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/$TARGET

# Kill android emulator
ps -ef | grep emulator64-x86
killall emulator64-x86

cordova emulate ios

sleep 15

ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/$IOS_TARGET -DtestFile $SCRIPTS_PATH/hybridTestSources/hybridTestSuite.txt -DdeviceUrl $ios_deviceURL
ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml replaceTestsName -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/$IOS_TARGET

killall "Simulator"

