result=$(curl -X POST -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW" -F "$1=@$1" 'http://localhost:9080/mfpadmin/management-apis/2.0/runtimes/mfp/adapters')
echo $result
if [[ $result == *"FAILURE"* ]]
then
sleep 2
result=$(curl -X POST -H "Authorization: Basic YWRtaW46YWRtaW4=" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW" -F "$1=@$1" 'http://localhost:9080/mfpadmin/management-apis/2.0/runtimes/mfp/adapters')
echo $result
	if [[ $result == *"FAILURE"* ]]
	then
	exit 1
	fi
fi