deviceURL=http://127.0.0.1:10081/
AVD_NAME="Nexus_5_API_21"
cd /Users/bob/Documents/Developer/Quickbuild/tests/Android

for d in */ ; do
 cd "$d"
 pwd
 /Users/bob/Documents/Developer/Quickbuild/scripts/deployAndroidApp.sh ${d%?} 1
 if [ -d "./adapters" ]; then
 	cd adapters/
 	for a in * ; do
   		echo "$a\n"
   		/Users/bob/Documents/Developer/Quickbuild/scripts/deployAdapter.sh $a
 	done
 	cd ../
 fi
 
 if [ -f "./setup.sh" ]; then
	./setup.sh
 fi
 
 cd app/
 for d2 in */ ; do
 /Users/bob/Documents/Developer/Quickbuild/scripts/compileAndroidApp.sh $(pwd)/$d2
 /Users/bob/Documents/Developer/Quickbuild/scripts/runAndroidEmulator.sh ${d%?} $(pwd)/$d2 $AVD_NAME
 ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/${d%?} -DtestFile $(pwd)/../testSuite.txt -DdeviceUrl $deviceURL
 ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml replaceTestsName -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/${d%?}

 ps -ef | grep emulator64-x86
 killall emulator64-x86
 done
 cd ../../
done