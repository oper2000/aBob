SCRIPT_DIR=/Users/bob/Documents/Developer/Quickbuild/scripts
yes | cp $SCRIPT_DIR/appDescriptorAndroidTemplate.json $SCRIPT_DIR/appDescriptorAndroid.json
sed -i.bak "s/packageNameTemplate/$1/g" $SCRIPT_DIR/appDescriptorAndroid.json
sed -i.bak "s/VersionTemplate/$2/g" $SCRIPT_DIR/appDescriptorAndroid.json
curl -X POST -H "Authorization: Basic ZGVtbzpkZW1v" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW" -F "appDescriptorAndroid.json=@$SCRIPT_DIR/appDescriptorAndroid.json" 'http://localhost:9080/mfpadmin/management-apis/2.0/runtimes/mfp/deploy?type=APP_DESCRIPTOR'