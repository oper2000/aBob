resultMissing=""
REPORTS_PATH=~/Documents/Developer/Quickbuild/Reports
iosSimulatorFolder=`ls -td -- ~/Library/Logs/CoreSimulator/*/ | head -n 1`
for txt2verify in {"wl.test : debug \[1,2,3\]","wl.test : log testLogger:log message","wl.test : info 1 2 3","wl.test : error Error: testLogger:oh no","wl.test : fatal testLogger: fatal message","MyTestReceiver found. Removing","Showing Splash Screen","testReloadApp"}
do
	found=`grep -c "$txt2verify" $REPORTS_PATH/latest/$1/logcat.log`  
	if [[ $found == 0 ]]; then
		resultMissing+="Android Platform :$txt2verify<br>"
	fi
	found=`grep -c "$txt2verify" $iosSimulatorFolder/system.log`  
	if [[ $found == 0 ]]; then
		resultMissing+="ioS Platform :$txt2verify<br>"
	fi
done

if test -n "$resultMissing"; then
  echo "<!DOCTYPE html><html><body><h1>Hybrid logcat verification report<br>&nbsp;Following missing from simulator system log</h1>" > $REPORTS_PATH/latest/$1/logcatFailureReport.html
  echo "$resultMissing" >> $REPORTS_PATH/latest/$1/logcatFailureReport.html
  echo "</body></html>" >> $REPORTS_PATH/latest/$1/logcatFailureReport.html
fi

