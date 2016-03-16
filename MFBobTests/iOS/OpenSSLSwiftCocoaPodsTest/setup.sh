TEST_ROOT="/Users/bob/Documents/Developer/Quickbuild/tests/iOS/OpenSSLSwiftCocoaPodsTest/app/OpenSSLSwiftCocoaPodsTest"
cd $TEST_ROOT
pod update
open "OpenSSLSwiftCocoaPodsTest.xcworkspace"
sleep 15
killall Xcode