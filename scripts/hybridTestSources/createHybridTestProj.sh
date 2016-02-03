echo "creating project $1"
cordova create $1
cd $1
cordova platform add ios@4.0.1
cordova platform add android@5.0.0
npm config set registry http://visustar.francelab.fr.ibm.com:8081/nexus/content/repositories/mobile-npm-all/
#cordova plugin add org.apache.cordova.file
cordova  plugin add cordova-plugin-mfp


gsed -i '/app.receivedEvent(.deviceready.);/a\\t\tvar buttonOne = document.getElementById("button1");\n\t\tbuttonOne.addEventListener("click", function(){\n\t\t\ttestSDK();\n\t\t}, false);' ./www/js/index.js
gsed -i '/Apache Cordova/a\\t\t\t<button type="button" id="button1">Click Me!<\/button>' ./www/index.html
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

gsed -i 's/10.0.0.1/ibobs-mac-mini.haifa.ibm.com/g' ./config.xml

rm -fr ./platforms/ios
tar -zxvf ../hybridTestSources/ios.tar.gz -C platforms
cordova plugin update cordova-plugin-mfp --save


cordova prepare
cordova compile

