#!/bin/sh

TEST_ROOT=$1
SDK_ROOT="/Users/bob/Documents/Developer/Quickbuild/SDK"
cd "$TEST_ROOT"
echo "replacing SDK in $TEST_ROOT"

path1=$(find $TEST_ROOT -name IBMMobileFirstPlatformFoundation.framework | head -1)
path2=$(find $TEST_ROOT -name IBMMobileFirstPlatformFoundationOpenSSLUtils.framework | head -1)
path3=$(find $TEST_ROOT -name openssl.framework | head -1)

echo $path1

rm -rf "$path1"
cp -rf "$SDK_ROOT/imf-client-sdks/IBMMobileFirstPlatformFoundation/Frameworks/IBMMobileFirstPlatformFoundation.framework" "$path1"
rm -rf "$path2"
cp -rf "$SDK_ROOT/imf-client-sdks/IBMMobileFirstPlatformFoundation/Frameworks/IBMMobileFirstPlatformFoundationOpenSSLUtils.framework" "$path2"
rm -rf "$path3"
cp -rf "$SDK_ROOT/imf-client-sdks/IBMMobileFirstPlatformFoundation/Frameworks/openssl.framework" "$path3"

