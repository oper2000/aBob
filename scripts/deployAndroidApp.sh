SCRIPT_DIR=/Users/bob/Documents/Developer/Quickbuild/scripts
yes | cp $SCRIPT_DIR/appDescriptorAndroidTemplate.json $SCRIPT_DIR/appDescriptorAndroid.json
sed -i.bak "s/packageNameTemplate/$1/g" $SCRIPT_DIR/appDescriptorAndroid.json
sed -i.bak "s/VersionTemplate/$2/g" $SCRIPT_DIR/appDescriptorAndroid.json
curl -X POST -H "Content-Type: application/json" -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Cache-Control: no-cache" -d "@$SCRIPT_DIR/appDescriptorAndroid.json" "http://localhost:9080/mfpadmin/management-apis/2.0/runtimes/mfp/applications"