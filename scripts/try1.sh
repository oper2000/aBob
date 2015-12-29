wait-for-emulator-ready() {
	echo "start waiting for emulator"
	seconds=0
	MAX_WAIT_SECONDS=120
	res=""
	while [ $seconds -lt ${MAX_WAIT_SECONDS} ]
	do
		sleep 5
		seconds=`expr $seconds + 5`
	
		res=$(adb shell getprop init.svc.bootanim)
		echo $res
		if [[ $res == *"stopped"*  ]]
		then
			echo "stopping 123"
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

wait-for-emulator-ready