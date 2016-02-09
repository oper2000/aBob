WATCH="Apple Watch - 42mm (2.1) [4A3DA953-8E26-47F3-9C1D-0E303A354F2C]"
Watch_Url=http://127.0.0.1:10080/
DESTINATION_DEVICE='generic/platform=iOS'
DESTINATION='platform=iOS Simulator,name=iPhone 6,OS=latest'
DESTINATION2='platform=iOS Simulator,OS=latest,name=iPhone 6s Plus'
Report_Dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/

if [[ "$1" != "compile" ]]; then
connected_devices=$(ios-deploy -c)
fi

if [[ "$1" = "7" ]]; then
echo "testing using iOS7 is requested"
if [[ $connected_devices = *"39e78b6a846912999c0ee59c58cbe8c979274dbc"*  ]]; then
echo "found device: iPhone5.7.1;39e78b6a846912999c0ee59c58cbe8c979274dbc"
DEVICE="iPhone5.7.1;39e78b6a846912999c0ee59c58cbe8c979274dbc"
UsingDevice="YES"
else
echo "no device found, using simulator: TODO"
DEVICE="TODO"
UsingDevice="NO"
fi
fi

if [[ "$1" = "8" ]]; then
echo "testing using iOS8 is requested"
if [[ $connected_devices = *"38e22ee28a37f0f5113dfb6ca364dd0847eb80f6"*  ]]; then
echo "found device: iPhone5c8.1.2;38e22ee28a37f0f5113dfb6ca364dd0847eb80f6"
DEVICE="iPhone5c8.1.2;38e22ee28a37f0f5113dfb6ca364dd0847eb80f6"
UsingDevice="YES"
else
echo "no device found, using simulator: iPhone 6 (8.1) [FA616278-0F27-4571-8260-B52DA93ACE6C]"
DEVICE='iPhone 6 (8.1) [FA616278-0F27-4571-8260-B52DA93ACE6C]'
UsingDevice="NO"
fi
fi

if [[ "$1" = "9" ]]; then
echo "testing using iOS9 is requested"
if [[ $connected_devices = *"fa303e8643d5871d31a7ea7cd9e18400972e75ca"*  ]]; then
echo "found device: iPhone6.8.4.1;fa303e8643d5871d31a7ea7cd9e18400972e75ca"
DEVICE="iPhone6.8.4.1;fa303e8643d5871d31a7ea7cd9e18400972e75ca"
UsingDevice="YES"
else
echo "no device found, using simulator: iPhone 6s (9.2) [DF2457E1-0649-4B45-8B1B-C3EC0A2A5461]"
DEVICE='iPhone 6s (9.2) [DF2457E1-0649-4B45-8B1B-C3EC0A2A5461]'
UsingDevice="NO"
fi
fi

if [[ "$1" != "compile" ]]; then
if [[ "$UsingDevice" = "NO" ]]; then
deviceURL=http://127.0.0.1:8080/
else
deviceHost=$(echo ${DEVICE} | cut -d';' -f1)
echo "device host is: $deviceHost trying to resolve ip"
deviceURL=http://$(host $deviceHost.haifa.ibm.com | tail -n1 | cut -d' ' -f4):8080/
echo device url is: $deviceURL
fi
fi

cd /Users/bob/Documents/Developer/Quickbuild/tests/iOS

for d in */ ; do
 cd "$d"
 pwd
 if [[ "$1" = "compile" ]]; then
 /Users/bob/Documents/Developer/Quickbuild/scripts/deployiOSApp.sh ${d%?} 1.0
 /Users/bob/Documents/Developer/Quickbuild/scripts/deployiOSApp.sh ${d%?} 1
 fi
 if [ -d "./adapters" ] && [ "$1" = "compile" ] ; then
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
 if [ ! -f "../setup.sh" ] && [ "$1" = "compile" ] ; then
	/Users/bob/Documents/Developer/Quickbuild/scripts/replaceiOSSDK.sh $(pwd)/$d2
 fi
 
 TEST_ROOT=$(pwd)/$d2
 APP_NAME=${d2%?}
 
 if [[ "$1" = "compile" ]]; then
 # compiling app
 #cd $TEST_ROOT
 rm -rf ${TEST_ROOT}*.app

 if [ -d "${TEST_ROOT}Watch Extension" ]; then
 echo "building watch app"
 #-destination "$DESTINATION"
 xcodebuild OTHER_CFLAGS="-fembed-bitcode" -workspace $TEST_ROOT$APP_NAME.xcworkspace  -scheme Watch -configuration Debug clean build CODE_SIGNING_REQUIRED=YES -destination "$DESTINATION_DEVICE" CONFIGURATION_BUILD_DIR="$TEST_ROOT"
 rc=$?; if [[ $rc != 0 ]]; then
 echo ***build failed***; exit $rc; fi
 mv ${TEST_ROOT}${APP_NAME}.app ${TEST_ROOT}${APP_NAME}Device.app
 xcodebuild OTHER_CFLAGS="-fembed-bitcode" -workspace $TEST_ROOT$APP_NAME.xcworkspace  -scheme Watch -configuration Debug clean build CODE_SIGNING_REQUIRED=NO -destination "$DESTINATION2" CONFIGURATION_BUILD_DIR="$TEST_ROOT"
 rc=$?; if [[ $rc != 0 ]]; then
 echo ***build failed***; exit $rc; fi
 else
 echo "building regular app"
 if [ -d "${TEST_ROOT}$APP_NAME.xcworkspace" ]; then
 echo "$APP_NAME.xcworkspace found"
	#echo xcodebuild OTHER_CFLAGS="-fembed-bitcode" -workspace $APP_NAME.xcworkspace  -scheme $APP_NAME -configuration Debug clean build CODE_SIGNING_REQUIRED=YES CONFIGURATION_BUILD_DIR="$TEST_ROOT"
	xcodebuild OTHER_CFLAGS="-fembed-bitcode" -workspace $TEST_ROOT$APP_NAME.xcworkspace  -scheme $APP_NAME -configuration Debug clean build CODE_SIGNING_REQUIRED=YES -destination "$DESTINATION_DEVICE" CONFIGURATION_BUILD_DIR="$TEST_ROOT"
    rc=$?; if [[ $rc != 0 ]]; then
    echo ***build failed***; exit $rc; fi
    mv ${TEST_ROOT}${APP_NAME}.app ${TEST_ROOT}${APP_NAME}Device.app
    xcodebuild OTHER_CFLAGS="-fembed-bitcode" -workspace $TEST_ROOT$APP_NAME.xcworkspace  -scheme $APP_NAME -configuration Debug clean build CODE_SIGNING_REQUIRED=YES -destination "$DESTINATION" CONFIGURATION_BUILD_DIR="$TEST_ROOT"
 	rc=$?; if [[ $rc != 0 ]]; then
    echo ***build failed***; exit $rc; fi
 else
	echo "$APP_NAME.xcworkspace not found"
	current_dir=$(pwd)
	cd $TEST_ROOT
	xcodebuild OTHER_CFLAGS="-fembed-bitcode" -target $APP_NAME.xcodeproj -scheme $APP_NAME  -configuration Debug clean build CODE_SIGNING_REQUIRED=YES -destination "$DESTINATION_DEVICE" CONFIGURATION_BUILD_DIR="$TEST_ROOT"
 	rc=$?; if [[ $rc != 0 ]]; then
    echo ***build failed***; exit $rc; fi    
    mv ${TEST_ROOT}${APP_NAME}.app ${TEST_ROOT}${APP_NAME}Device.app
	xcodebuild OTHER_CFLAGS="-fembed-bitcode" -target $APP_NAME.xcodeproj -scheme $APP_NAME  -configuration Debug clean build CODE_SIGNING_REQUIRED=YES -destination "$DESTINATION" CONFIGURATION_BUILD_DIR="$TEST_ROOT"
 	rc=$?; if [[ $rc != 0 ]]; then
    echo ***build failed***; exit $rc; fi 	
 	cd $current_dir
 fi
 fi
 fi
 

if [[ "$1" != "compile" ]]; then
REPORT_NAME="iOS$1"
if [[ "$UsingDevice" = "NO" ]]; then
REPORT_NAME=${REPORT_NAME}Simulator
else
REPORT_NAME=${REPORT_NAME}Device
fi
# running test
/Users/bob/Documents/Developer/Quickbuild/scripts/runiOSAppNew.sh $TEST_ROOT $APP_NAME No "$DEVICE" ${Report_Dir}${REPORT_NAME}/$APP_NAME $(pwd)/../testSuite.txt $deviceURL
echo "checking if watch testing is needed"
 if [ -d "${TEST_ROOT}Watch Extension" ] && [ ! -d "${Report_Dir}Watch/$APP_NAME" ] ; then
 echo "yes"
 /Users/bob/Documents/Developer/Quickbuild/scripts/deployiOSApp.sh ${d%?}.watchkitapp.watchkitextension 1.0
 /Users/bob/Documents/Developer/Quickbuild/scripts/deployiOSApp.sh ${d%?}.watchkitapp.watchkitextension 1
 /Users/bob/Documents/Developer/Quickbuild/scripts/runiOSAppNew.sh $TEST_ROOT $APP_NAME YES "$WATCH" ${Report_Dir}Watch/$APP_NAME $(pwd)/../testSuite.txt $Watch_Url
 else
 echo "no"
 fi
 fi
 
 echo $d2
 done
 cd ../../
done