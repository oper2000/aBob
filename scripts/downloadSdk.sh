cd /Users/bob/Documents/Developer/Quickbuild/
echo "downloading from " "$1"

if [ -d "./SDK" ]; then
rm -rf ./SDK
fi

if [ -f "./imf-client-sdks.zip" ]; then
rm  ./imf-client-sdks.zip
fi

curl -o imf-client-sdks.zip "$1"/imf-client-sdks.zip
mkdir SDK
unzip imf-client-sdks.zip -d SDK
curl -o SDK/ibmmobilefirstplatformfoundation.aar "$1"/ibmmobilefirstplatformfoundation.aar