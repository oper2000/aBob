#!/bin/sh

echo $1
echo $2
echo $3
echo $4
echo $5
echo $6
AVD_NAME=$3
REPORT_NAME=$4
TEST_SUITE=$5
deviceURL=$6


using_emulator="NO"
if [[ $AVD_NAME == *"API"* ]]
then
echo "using emulator $AVD_NAME"
device=emulator-5554
using_emulator="YES"
else
echo "using device $AVD_NAME"
device=$AVD_NAME
fi

source ~/.bash_profile

waitForEmulator() {
	echo "start waiting for emulator"
	seconds=0
	MAX_WAIT_SECONDS=240
	res=""
	while [ $seconds -lt ${MAX_WAIT_SECONDS} ]
	do
		sleep 5
		seconds=`expr $seconds + 5`
	
		res=$(adb -s $device shell getprop init.svc.bootanim)
		if [[ $res == *"stopped"*  ]]
		then
			break
		else
			echo "Ok. Waiting for Android emulator ${AVD_NAME}. Elapsed time: ${seconds} of ${MAX_WAIT_SECONDS} seconds."
		fi
	done
	if [[ $res = *"stopped"*  ]]
	then
		echo "Ok. Android emulator ${AVD_NAME} is ready."
	else
		echo "ERROR. Android emulator ${AVD_NAME} is not ready. Waited ${MAX_WAIT_SECONDS} seconds."
		exit -1
	fi
}


if [[ $using_emulator = "YES" ]]
then
	/Users/bob/Library/Android/sdk/tools/emulator -avd $AVD_NAME -netspeed full -netdelay none &
	waitForEmulator
	echo "back from wait-for-emulator"
fi

#adb shell getprop init.svc.bootanim
adb -s $device uninstall $1 
echo "echo adb -s $device install $2app/build/outputs/apk/app-debug.apk"
adb -s $device install $2app/build/outputs/apk/app-debug.apk

if [[ $using_emulator = "YES" ]]
then
	adb -s $device forward tcp:10081 tcp:10080
fi

adb -s $device shell am start -n "$1/$1.MainActivity" -a android.intent.action.MAIN -c android.intent.category.LAUNCHER
adb -s $device logcat > $2app/build/outputs/logs/$ReportName.logcat.log &

ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/$REPORT_NAME/$1 -DtestFile=$TEST_SUITE -DdeviceUrl=$deviceURL
ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml replaceTestsName -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/$REPORT_NAME/$1

if [[ $using_emulator = "YES" ]]
then
	ps -ef | grep emulator64-x86
	killall emulator64-x86
fi
