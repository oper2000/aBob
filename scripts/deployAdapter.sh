result=$(curl -X POST -H "Authorization: Basic ZGVtbzpkZW1v" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW" -F "$1=@$1" 'http://localhost:9080/mfpadmin/management-apis/2.0/runtimes/mfp/deploy?type=ADAPTER_CONTENT')
echo $result
if [[ $result == *"FAILURE"* ]]
then
sleep 2
result=$(curl -X POST -H "Authorization: Basic ZGVtbzpkZW1v" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW" -F "$1=@$1" 'http://localhost:9080/mfpadmin/management-apis/2.0/runtimes/mfp/deploy?type=ADAPTER_CONTENT')
echo $result
	if [[ $result == *"FAILURE"* ]]
	then
	exit 1
	fi
fi