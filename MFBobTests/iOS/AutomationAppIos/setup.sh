cd /Users/bob/Documents/Developer/Quickbuild/tests/IOS/AutomationAppIos/app/AutomationAppIos
pod update
open "AutomationAppIos.xcworkspace"
sleep 15
killall Xcode
if [[ "$USER" = "norton" ]]; then
 	sed -i.bak s/"<string>ibobs-mac-mini.haifa.ibm.com</string>"/"<string>9.109.250.170</string>"/g $(pwd)/AutomationAppIos/mfpclient.plist
fi