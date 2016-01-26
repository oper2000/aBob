deviceURL=http://127.0.0.1:10081/
PROJ_NAME=hypridProj
SCRIPTS_PATH=/Users/bob/Documents/Developer/Quickbuild/scripts
TARGET_PARAM="--target=Nexus_5_API_21_hybrid"
if [ ! -d $SCRIPTS_PATH ]
then
	SCRIPTS_PATH=.
	TARGET_PARAM=""
fi

cd $SCRIPTS_PATH

./createHybridTestProj.sh $PROJ_NAME

./deployAndroidApp.sh io.cordova.hellocordova 0.0.1
./deployiOSApp.sh io.cordova.hellocordova 0.0.1

cd $PROJ_NAME
echo "NoStatus" > ./status.txt

cordova run android $TARGET_PARAM


echo "getting status from simulator"
testStatus="NoStatus"
while [ "$testStatus" == "NoStatus" ] || [ "$testStatus" == "" ]
do
	if [ `$ANDROID_HOME/platform-tools/adb shell "if [ -e /sdcard/Android/data/io.cordova.hellocordova/files/status.txt ]; then echo 1; fi"` ]; then 
		$ANDROID_HOME/platform-tools/adb pull /sdcard/Android/data/io.cordova.hellocordova/files/status.txt .;
		testStatus=`cat ./status.txt`;
	fi
done

cd ..

TARGET_TEST_LOG=$SCRIPTS_PATH/hypridProj/platforms/android/hybrid-android.html
echo "<!DOCTYPE html><html><body><h1>Android Hybrid test</h1><p>" > $TARGET_TEST_LOG
echo $testStatus >> $TARGET_TEST_LOG
echo "</p></body></html>" >> $TARGET_TEST_LOG

echo "NoStatus" > ./status.txt
$ANDROID_HOME/platform-tools/adb push ./$PROJ_NAME/status.txt /sdcard/Android/data/io.cordova.hellocordova/files/status.txt

# Kill android emulator
ps -ef | grep emulator64-x86
killall emulator64-x86


#TODO 
# 1. run ios app on emulator
# 2. check ios test run results
# 3. stop ios simulator
# 4. deploy ios results to ibob

