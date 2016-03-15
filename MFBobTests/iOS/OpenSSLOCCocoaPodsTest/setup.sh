TEST_ROOT="/Users/bob/Documents/Developer/Quickbuild/tests/iOS/OpenSSLOCCocoaPodsTest/app/"
rm -rf "$TEST_ROOT/OpenSSLOCCocoaPodsTest"
cp -rf "$TEST_ROOT/../template/OpenSSLOCCocoaPodsTest" "$TEST_ROOT/OpenSSLOCCocoaPodsTest"
cd "$TEST_ROOT/OpenSSLOCCocoaPodsTest"
pod install
open "OpenSSLOCCocoaPodsTest.xcworkspace"
sleep 15
killall Xcode