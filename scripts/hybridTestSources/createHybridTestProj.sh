if [ -d $1 ]
then
	echo "deleting existing $1 project"
	rm -fr $1
fi


echo "creating project $1"
cordova create $1
cd $1
cordova platform add ios
cordova platform add android
npm config set registry http://visustar.francelab.fr.ibm.com:8081/nexus/content/repositories/mobile-npm-all/
if [ "$USER" == "bob" ]
then
	cordova plugin add cordova-plugin-crosswalk-webview
fi
cordova  plugin add cordova-plugin-mfp


gsed -i '/app.receivedEvent(.deviceready.);/a\\t\tvar buttonOne = document.getElementById("button1");\n\t\tbuttonOne.addEventListener("click", function(){\n\t\t\ttestSDK();\n\t\t}, false);' ./www/js/index.js
gsed -i '/Apache Cordova/a\\t\t\t<button type="button" id="button1">Automation Hybrid App!<\/button>' ./www/index.html
cat ./../hybridTestSources/SDKTest.js >> ./www/js/index.js


gsed -i '/import com.worklight.androidgap.api.WL;/aimport com.worklight.androidgap.api.WLActionReceiver;\nimport org.json.JSONException;\nimport org.json.JSONObject;\nimport fi.iki.elonen.NanoHTTPD;\nimport fi.iki.elonen.util.ServerRunner;\n' ./platforms/android/src/io/cordova/hellocordova/MainActivity.java
gsed -i 's/implements WLInitWebFrameworkListener/implements WLInitWebFrameworkListener, WLActionReceiver/g' ./platforms/android/src/io/cordova/hellocordova/MainActivity.java
gsed -i '/implements WLInitWebFrameworkListener/a\\tpublic AutomationServer server;' ./platforms/android/src/io/cordova/hellocordova/MainActivity.java
gsed -i '/onInitWebFrameworkComplete/a\\t\tif (server == null){\
\t\t\ttry {\
\t\t\t\tWL.getInstance().addActionReceiver(this);\
\t\t\t\tserver = new AutomationServer();\
\t\t\t\tserver.start();\n\t\t\t} catch (Exception e) {}\
\t\t\t}' ./platforms/android/src/io/cordova/hellocordova/MainActivity.java
gsed -i '$ d' ./platforms/android/src/io/cordova/hellocordova/MainActivity.java
cat ./../hybridTestSources/mainActivityChanges.txt >> ./platforms/android/src/io/cordova/hellocordova/MainActivity.java

cp ./../hybridTestSources/nanohttpd-2.2.0.jar ./platforms/android/libs

mfpdev app register
if [[ "$USER" = "norton" ]]; then
gsed -i 's/10.0.0.1/9.109.250.170/g' ./config.xml
else
gsed -i 's/10.0.0.1/ibobs-mac-mini.haifa.ibm.com/g' ./config.xml
fi



mv ./platforms/ios ./platforms/ios-save
echo "extracting the ios project from tar file ios.tar.gz...."
tar -zxf ../hybridTestSources/ios.tar.gz -C platforms
rm -fr ./platforms/ios/www/plugins
rm -fr ./platforms/ios/www/js
rm -fr ./platforms/ios/platform_www/plugins
mv ./platforms/ios-save/www/plugins ./platforms/ios/www
mv ./platforms/ios-save/www/js ./platforms/ios/www
mv ./platforms/ios-save/platform_www/plugins ./platforms/ios/platform_www/
rm -fr ./platforms/ios-save

rm -fr ./platforms/ios/HelloCordova/Plugins/cordova-plugin-mfp/*.framework
cp  -r ./plugins/cordova-plugin-mfp/src/ios/Frameworks/* ./platforms/ios/HelloCordova/Plugins/cordova-plugin-mfp/

mfpdev app config android_security_test_web_resources_checksum true

mkdir ./www/certificates/
cp ./../hybridTestSources/*.cer ./www/certificates/

cordova prepare
cordova compile

