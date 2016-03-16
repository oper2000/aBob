cd /Users/bob/Documents/Developer/Quickbuild/tests/IOS/AutomationAppIos/app/AutomationAppIos
pod update
open "AutomationAppIos.xcworkspace"
sleep 15
killall Xcode
if [[ "$USER" = "norton" ]]; then
 	sed -i.bak s/"ibobs-mac-mini.haifa.ibm.com"/"9.109.250.170"/g $(pwd)/AutomationAppIos/mfpclient.plist
fi