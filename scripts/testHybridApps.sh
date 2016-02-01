deviceURL=http://127.0.0.1:10081/
PROJ_NAME=hybridProj
SCRIPTS_PATH=/Users/bob/Documents/Developer/Quickbuild/scripts
TARGET=Nexus_5_API_21_hybrid
TARGET_PARAM="--target=$TARGET"
if [ ! -d $SCRIPTS_PATH ]
then
	SCRIPTS_PATH=.
	TARGET_PARAM=""
fi

cd $SCRIPTS_PATH

./hybridTestSources/createHybridTestProj.sh $PROJ_NAME

./deployAndroidApp.sh io.cordova.hellocordova 0.0.1
./deployiOSApp.sh io.cordova.hellocordova 1

cd $PROJ_NAME

cordova run android $TARGET_PARAM

ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/$TARGET -DtestFile $SCRIPTS_PATH/hybridTestSources/hybridTestSuite.txt -DdeviceUrl $deviceURL
ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml replaceTestsName -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/$TARGET

# Kill android emulator
ps -ef | grep emulator64-x86
killall emulator64-x86


#TODO 
# 1. run ios app on emulator
# 2. check test run results
# 3. stop simulator
# 4. deploy results to ibob

# Do we need the setup ???
# if [ -f "./setup.sh" ]; then
#	./setup.sh
# fi

