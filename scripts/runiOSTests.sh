deviceURL=http://127.0.0.1:8080/
deviceURLWatch=http://127.0.0.1:10080/
cd /Users/bob/Documents/Developer/Quickbuild/tests/iOS

for d in */ ; do
 cd "$d"
 pwd
 /Users/bob/Documents/Developer/Quickbuild/scripts/deployiOSApp.sh ${d%?} 1.0
 /Users/bob/Documents/Developer/Quickbuild/scripts/deployiOSApp.sh ${d%?} 1
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
 if [ ! -f "../setup.sh" ]; then
	/Users/bob/Documents/Developer/Quickbuild/scripts/replaceiOSSDK.sh $(pwd)/$d2
 fi
 /Users/bob/Documents/Developer/Quickbuild/scripts/runiOSApp.sh $(pwd)/$d2 ${d2%?} No
 sleep 5
 ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/${d%?} -DtestFile $(pwd)/../testSuite.txt -DdeviceUrl $deviceURL
 ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml replaceTestsName -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/${d%?}
 /Users/bob/Documents/Developer/Quickbuild/scripts/tearupiOStest.sh $(pwd)/$d2

 if [ -d "$(pwd)/$d2/Watch Extension" ]; then
 /Users/bob/Documents/Developer/Quickbuild/scripts/deployiOSApp.sh ${d%?}.watchkitapp.watchkitextension 1.0
 /Users/bob/Documents/Developer/Quickbuild/scripts/deployiOSApp.sh ${d%?}.watchkitapp.watchkitextension 1
 /Users/bob/Documents/Developer/Quickbuild/scripts/runiOSApp.sh $(pwd)/$d2 ${d2%?} Yes
 sleep 5
 ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/${d%?}.Watch -DtestFile $(pwd)/../testSuite.txt -DdeviceUrl $deviceURLWatch
 ant -f /Users/bob/Documents/Developer/Quickbuild/scripts/testng/runTests.xml replaceTestsName -Dreport.dir=/Users/bob/Documents/Developer/Quickbuild/Reports/latest/${d%?}.Watch
 /Users/bob/Documents/Developer/Quickbuild/scripts/tearupiOStest.sh $(pwd)/$d2
 fi
 
 echo $d2
 done
 cd ../../
done