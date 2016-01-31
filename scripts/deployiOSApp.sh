SCRIPT_DIR=/Users/bob/Documents/Developer/Quickbuild/scripts
yes | cp "$SCRIPT_DIR/appDescriptoriOSTemplate.json" "$SCRIPT_DIR/appDescriptoriOS.json"
sed -i.bak "s/AppBundle/$1/g" "$SCRIPT_DIR/appDescriptoriOS.json"
sed -i.bak "s/AppVersion/$2/g" "$SCRIPT_DIR/appDescriptoriOS.json"
curl -X POST -H "Content-Type: application/json" -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Cache-Control: no-cache" -d "@$SCRIPT_DIR/appDescriptoriOS.json" "http://localhost:9080/mfpadmin/management-apis/2.0/runtimes/mfp/applications"