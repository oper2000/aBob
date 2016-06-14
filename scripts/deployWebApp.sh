SCRIPT_DIR=/Users/bob/Documents/Developer/Quickbuild/scripts
result=$(curl -X POST -H "Content-Type: application/json" -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Cache-Control: no-cache" -d "@$SCRIPT_DIR/appDescriptorWeb.json" "http://localhost:9080/mfpadmin/management-apis/2.0/runtimes/mfp/applications")
echo $result
if [[ $result == *"FAILURE"* ]]
	then
	exit 1
fi