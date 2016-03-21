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

killall emulator64-x86
$ANDROID_HOME/tools/emulator -avd $TARGET -netspeed full -netdelay none  &

./hybridTestSources/createHybridTestProj.sh $PROJ_NAME

appName=io.cordova.hellocordova
REPORT_NAME=$TARGET

cd $PROJ_NAME

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
	adb -s $device forward tcp:10081 tcp:10080

	cordova run android

	mkdir $REPROTS_PATH/latest/$TARGET/
	adb -s $device logcat > $REPROTS_PATH/latest/$TARGET/logcat.log & PID=$!

	sleep 10

# 	ant -f $SCRIPTS_PATH/testng/runTests.xml -Dreport.dir=$REPROTS_PATH/latest/$TARGET -DtestFile $SCRIPTS_PATH/hybridTestSources/hybridTestSuite.txt -DdeviceUrl $deviceURL
# 	ant -f $SCRIPTS_PATH/testng/runTests.xml replaceTestsName -Dreport.dir=$REPROTS_PATH/latest/$TARGET

	# Kill android emulator
	# ps -ef | grep emulator64-x86
	killall emulator64-x86
else
  	echo "Error:Simulator did not start successfully"
fi


cordova emulate ios

sleep 15

ant -f $SCRIPTS_PATH/testng/runTests.xml -Dreport.dir=$REPROTS_PATH/latest/$IOS_TARGET -DtestFile $SCRIPTS_PATH/hybridTestSources/hybridTestSuite.txt -DdeviceUrl $ios_deviceURL
ant -f $SCRIPTS_PATH/testng/runTests.xml replaceTestsName -Dreport.dir=$REPROTS_PATH/latest/$IOS_TARGET

killall "Simulator"

$SCRIPTS_PATH/hybridTestSources/verifyTestResultsOnLogcat.sh $TARGET

