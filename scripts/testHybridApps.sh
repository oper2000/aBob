#!/bin/sh

deviceURL=http://127.0.0.1:10081/
ios_deviceURL=http://127.0.0.1:8080/
PROJ_NAME=hybridProj
SCRIPTS_PATH=/Users/bob/Documents/Developer/Quickbuild/scripts/
REPROTS_PATH=/Users/bob/Documents/Developer/Quickbuild/Reports
TARGET=Nexus_5_API_23_hybrid
IOS_TARGET=hybrid_IOS
device=emulator-5554

cd $SCRIPTS_PATH

./hybridTestSources/createHybridTestProj.sh $PROJ_NAME

appName=io.cordova.hellocordova
REPORT_NAME=$TARGET

$ANDROID_HOME/tools/emulator -avd $TARGET -netspeed full -netdelay none  &

output=''
counter=0
while [[ ${output:0:7} != 'stopped' && $counter -lt 60 ]]; do
  let counter=counter+1
  #echo $counter
  output=`adb -s $device shell getprop init.svc.bootanim`
  sleep 5
done

if [ ${output:0:7} == 'stopped' ]
then
	echo "emulator is up"
	adb -s $device shell input keyevent 82

	adb -s $device uninstall $appName 
	echo "echo adb -s $device install $SCRIPTS_PATH/hybridProj/platforms/android/build/outputs/apk/android-x86-debug.apk"
	adb -s $device install $SCRIPTS_PATH/hybridProj/platforms/android/build/outputs/apk/android-x86-debug.apk

	adb -s $device forward tcp:10081 tcp:10080

	adb -s $device shell am start -n "$appName/$appName.MainActivity" -a android.intent.action.MAIN -c android.intent.category.LAUNCHER
	mkdir $REPROTS_PATH/latest/$TARGET/
	adb -s $device logcat > $REPROTS_PATH/latest/$TARGET/logcat.log & PID=$!

	sleep 10

	ant -f $SCRIPTS_PATH/testng/runTests.xml -Dreport.dir=$REPROTS_PATH/latest/$TARGET -DtestFile $SCRIPTS_PATH/hybridTestSources/hybridTestSuite.txt -DdeviceUrl $deviceURL
	ant -f $SCRIPTS_PATH/testng/runTests.xml replaceTestsName -Dreport.dir=$REPROTS_PATH/latest/$TARGET

	# Kill android emulator
	ps -ef | grep emulator64-x86
	killall emulator64-x86
else
  	echo "Error:Simulator did not start successfully"
fi

cd $PROJ_NAME

cordova emulate ios

sleep 15

ant -f $SCRIPTS_PATH/testng/runTests.xml -Dreport.dir=$REPROTS_PATH/latest/$IOS_TARGET -DtestFile $SCRIPTS_PATH/hybridTestSources/hybridTestSuite.txt -DdeviceUrl $ios_deviceURL
ant -f $SCRIPTS_PATH/testng/runTests.xml replaceTestsName -Dreport.dir=$REPROTS_PATH/latest/$IOS_TARGET

killall "Simulator"

$SCRIPTS_PATH/hybridTestSources/verifyTestResultsOnLogcat.sh $TARGET

