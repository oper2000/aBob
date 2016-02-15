#!/bin/sh
#emulatorURL=http://127.0.0.1:10081/


# Android version YES/NO $1=4 $2=5 $3=6

 if [[ "$1" = "compile" ]]; then
 yes | rm /Users/bob/Documents/Developer/Quickbuild/Reports/latest/androidEmulatorUsed
 fi


connected_devices=$(adb devices)
deviceCounter=1
emulatorCounter=1

if [[ "$1" = "4" ]]; then
echo "testing using android version 4 is requested"
if [[ $connected_devices = *"8e8997a0"*  ]]; then
echo "found device: Galaxy4_4.4.2;8e8997a0 adding it to devices queue"
DEVICES[$deviceCounter]="Galaxy4_4.4.2;8e8997a0"
let deviceCounter=$deviceCounter+1
else
echo "no device found, adding emulator Nexus_5_API_19 to emulators queue"
EMULATORS[$emulatorCounter]="Nexus_5_API_19"
let emulatorCounter=$emulatorCounter+1
fi
fi

if [[ "$1" = "5" ]]; then
echo "testing using android version 5 is requested"
if [[ $connected_devices = *"0384979b2151b229"*  ]]; then
echo "found device: Nexus5_5.1;0384979b2151b229 adding it to devices queue"
DEVICES[$deviceCounter]="Nexus5_5.1;0384979b2151b229"
let deviceCounter=$deviceCounter+1
else
echo "no device found, adding emulator Nexus_5_API_21 to emulators queue"
EMULATORS[$emulatorCounter]="Nexus_5_API_21"
let emulatorCounter=$emulatorCounter+1
fi
fi

if [[ "$1" = "6" ]]; then
echo "testing using android version 6 is requested"
if [[ $connected_devices = *"038853422152e0b5"*  ]]; then
echo "found device: Nexus5_6.0;038853422152e0b5 adding it to devices queue"
DEVICES[$deviceCounter]="Nexus5_6.0;038853422152e0b5"
let deviceCounter=$deviceCounter+1
else
echo "no device found, adding emulator Nexus_5_API_23 to emulators queue"
EMULATORS[$emulatorCounter]="Nexus_5_API_23"
let emulatorCounter=$emulatorCounter+1
fi
fi


cd /Users/bob/Documents/Developer/Quickbuild/tests/Android

for d in */ ; do
 cd "$d"
 pwd
 if [[ "$1" = "compile" ]]; then
 /Users/bob/Documents/Developer/Quickbuild/scripts/deployAndroidApp.sh ${d%?} 1
 /Users/bob/Documents/Developer/Quickbuild/scripts/deployAndroidApp.sh ${d%?} 1.0
 fi
 if  [ -d "./adapters" ] && [ "$1" = "compile" ] ; then
 	cd adapters/
 	for a in * ; do
   		echo "$a\n"
   		/Users/bob/Documents/Developer/Quickbuild/scripts/deployAdapter.sh $a
 	done
 	cd ../
 fi
 
 if [ -f "./setup.sh" ] && [ "$1" = "compile" ] ; then
	./setup.sh
 fi
 
 cd app/
 for d2 in */ ; do
 if [[ "$1" = "compile" ]]; then
 yes |cp "$(pwd)/../testSuite.txt" "$(pwd)/${d2}app/src/main/assets/testSuite.txt"
 /Users/bob/Documents/Developer/Quickbuild/scripts/compileAndroidApp.sh $(pwd)/$d2
 rc=$?; if [[ $rc != 0 ]]; then
 echo ***build failed***; exit $rc; fi
 fi
 if [[ "$1" != "compile" ]]; then
 while [ $deviceCounter -gt 1 ]
 do
 let deviceCounter=$deviceCounter-1
 AVD_NAME=$(echo ${DEVICES[$deviceCounter]} | cut -d';' -f2)
 REPORT_NAME=$(echo ${DEVICES[$deviceCounter]} | cut -d';' -f1)
 #echo "AVD_NAME $AVD_NAME"
 deviceIP=$(adb -s $AVD_NAME shell ip addr show | grep 'global wlan0' | cut -d' ' -f6 | cut -d'/' -f1)
 deviceURL="http://$deviceIP:10080/"
 #echo "deviceAdd: $deviceURL"
 /Users/bob/Documents/Developer/Quickbuild/scripts/runAndroidEmulatorNew.sh ${d%?} $(pwd)/$d2 $AVD_NAME $REPORT_NAME $(pwd)/../testSuite.txt $deviceURL
 done
 
 #ps -ef | grep emulator64-x86
 #killall emulator64-x86
 
 while [ $emulatorCounter -gt 1 ]
 do
#  if [ ! -f /Users/bob/Documents/Developer/Quickbuild/Reports/latest/androidEmulatorUsed ]; then
#   echo "" > /Users/bob/Documents/Developer/Quickbuild/Reports/latest/androidEmulatorUsed
#  else
#  echo "emulator is already in use, aborting"
#  exit 1
#  fi
 let emulatorCounter=$emulatorCounter-1
 AVD_NAME=${EMULATORS[$emulatorCounter]}
 REPORT_NAME="Emulator.$AVD_NAME"
 deviceURL=http://127.0.0.1:10081/
 /Users/bob/Documents/Developer/Quickbuild/scripts/runAndroidEmulatorNew.sh ${d%?} $(pwd)/$d2 $AVD_NAME $REPORT_NAME $(pwd)/../testSuite.txt $deviceURL
 done

 #wait
 fi
 done
 cd ../../
done