cd /Users/bob/Documents/Developer/Quickbuild/

if [ -d "./mfp-server-console-artifacts" ]; then
rm -rf ./mfp-server-console-artifacts
fi

if [ -f "./mfp-server-console-artifacts.zip" ]; then
rm  ./mfp-server-console-artifacts.zip
fi

curl -o mfp-server-console-artifacts.zip http://halpert.austin.ibm.com/productionBuilds-electra-devops/LATEST-RELEASE/mfp-server-console-artifacts.zip

mkdir mfp-server-console-artifacts
unzip mfp-server-console-artifacts.zip -d mfp-server-console-artifacts
cd mfp-server-console-artifacts/console/

mkdir UserLogin
unzip UserLogin.zip -d UserLogin
cd UserLogin/UserLogin/

mvn clean install
rc=$?; if [[ $rc != 0 ]]; then
echo "***install user pass adapter failed***"; exit $rc; fi

yes | cp /Users/bob/Documents/Developer/Quickbuild/mfp-server-console-artifacts/console/UserLogin/UserLogin/target/UserLogin.adapter /Users/bob/Documents/Developer/Quickbuild/tests/Android/com.example.amitaim.automationapp/adapters/1UserLogin.adapter
rc=$?; if [[ $rc != 0 ]]; then
echo "***failed to copy the built adapter***"; exit $rc; fi