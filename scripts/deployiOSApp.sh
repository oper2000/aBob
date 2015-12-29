SCRIPT_DIR=/Users/bob/Documents/Developer/Quickbuild/scripts
yes | cp "$SCRIPT_DIR/appDescriptoriOSTemplate.json" "$SCRIPT_DIR/appDescriptoriOS.json"
sed -i.bak "s/AppBundle/$1/g" "$SCRIPT_DIR/appDescriptoriOS.json"
sed -i.bak "s/AppVersion/$2/g" "$SCRIPT_DIR/appDescriptoriOS.json"
curl -X POST -H "Authorization: Basic ZGVtbzpkZW1v" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW" -F "appDescriptoriOS.json=@$SCRIPT_DIR/appDescriptoriOS.json" 'http://localhost:9080/mfpadmin/management-apis/2.0/runtimes/mfp/deploy?type=APP_DESCRIPTOR'