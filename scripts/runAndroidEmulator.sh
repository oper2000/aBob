#!/bin/sh

#echo $1
#echo $2
#device=8e8997a0
device=emulator-5554
AVD_NAME=$3

source ~/.bash_profile

waitForEmulator() {
	echo "start waiting for emulator"
	seconds=0
	MAX_WAIT_SECONDS=120
	res=""
	while [ $seconds -lt ${MAX_WAIT_SECONDS} ]
	do
		sleep 5
		seconds=`expr $seconds + 5`
	
		res=$(adb shell getprop init.svc.bootanim)
		if [[ $res == *"stopped"*  ]]
		then
			break
		else
			echo "Ok. Waiting for Android emulator ${AVD_NAME}. Elapsed time: ${seconds} of ${MAX_WAIT_SECONDS} seconds."
		fi
	done
	if [[ $res == *"stopped"*  ]]
	then
		echo "Ok. Android emulator ${AVD_NAME} is ready."
	else
		echo "ERROR. Android emulator ${AVD_NAME} is not ready. Waited ${MAX_WAIT_SECONDS} seconds."
		exit -1
	fi
}


if [[ $device == "emulator-5554" ]]
then
	ps -ef | grep emulator64-x86
	killall emulator64-x86
	sleep 1
	/Users/bob/Library/Android/sdk/tools/emulator -avd $AVD_NAME -netspeed full -netdelay none &
	#sleep 120
	waitForEmulator
fi

#adb shell getprop init.svc.bootanim
echo "back from wait-for-emulator"
adb -s $device uninstall $1 
adb -s $device install $2app/build/outputs/apk/app-debug.apk

if [[ $device == "emulator-5554" ]]
then
	adb -s $device forward tcp:10081 tcp:10080
fi

adb -s $device shell am start -n "$1/$1.MainActivity" -a android.intent.action.MAIN -c android.intent.category.LAUNCHER
adb -s $device logcat > $2app/build/outputs/logs/logcat.log &