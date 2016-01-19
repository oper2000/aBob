deviceURL=http://127.0.0.1:10081/
AVD_NAME="Nexus_5_API_21"
PROJ_NAME=hypridProj
SCRIPTS_PATH=/Users/bob/Documents/Developer/Quickbuild/scripts
cd $SCRIPTS_PATH

./createHybridTestProj.sh $PROJ_NAME

./deployAndroidApp.sh io.cordova.hellocordova 1
./deployiOSApp.sh io.cordova.hellocordova 1

cd $PROJ_NAME
cordova emulate android 
cordova emulate ios
#./runAndroidEmulator.sh io.cordova.hellocordova ./$PROJ_NAME/platforms/android $AVD_NAME


#TODO 
# 1. run ios app on emulator
# 2. check test run results
# 3. stop simulators
# 4. deploy results to ibob

# Do we need the setup ???
# if [ -f "./setup.sh" ]; then
#	./setup.sh
# fi

# Kill android emulator
# 	ps -ef | grep emulator64-x86
# 	killall emulator64-x86

rm -fr ./$PROJ_NAME

cd -