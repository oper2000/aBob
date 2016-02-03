deviceURL=http://127.0.0.1:10081/
ios_deviceURL=http://127.0.0.1:8080/
PROJ_NAME=hybridProj
SCRIPTS_PATH=/Users/bob/Documents/Developer/Quickbuild/scripts
TARGET=Nexus_5_API_21_hybrid
TARGET_PARAM="--target=$TARGET"
IOS_TARGET=hybrid_IOS
device=emulator-5554

if [ ! -d $SCRIPTS_PATH ]
then
	SCRIPTS_PATH=.
	TARGET_PARAM=""
fi

cd $SCRIPTS_PATH

./hybridTestSources/createHybridTestProj.sh $PROJ_NAME

./deployAndroidApp.sh io.cordova.hellocordova 0.0.1
./deployiOSApp.sh io.cordova.hellocordova 0.0.1

cd $PROJ_NAME

cordova emulate android $TARGET_PARAM

adb -s $device forward tcp:10081 tcp:10080

ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/$TARGET -DtestFile $SCRIPTS_PATH/hybridTestSources/hybridTestSuite.txt -DdeviceUrl $deviceURL
ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml replaceTestsName -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/$TARGET

# Kill android emulator
ps -ef | grep emulator64-x86
killall emulator64-x86

cordova emulate ios

ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/$IOS_TARGET -DtestFile $SCRIPTS_PATH/hybridTestSources/hybridTestSuite.txt -DdeviceUrl $ios_deviceURL
ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml replaceTestsName -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/$IOS_TARGET

killall "Simulator"

