echo "creating project $1"
cordova create $1
cd $1
cordova platform add ios@4.0.0
cordova platform add android@5.0.0
npm config set registry http://visustar.francelab.fr.ibm.com:8081/nexus/content/repositories/mobile-npm-all/
cordova plugin add org.apache.cordova.file
cordova  plugin add cordova-plugin-mfp
cordova prepare

gsed -i '/app.receivedEvent(.deviceready.);/a\\t\tvar buttonOne = document.getElementById("button1");\n\t\tbuttonOne.addEventListener("click", function(){\n\t\t\ttestSDK();\n\t\t}, false);' ./www/js/index.js
gsed -i '/Apache Cordova/a\\t\t\t<button type="button" id="button1">Click Me!<\/button>' ./www/index.html
cat ./../hybridTests/SDKTest.js >> ./www/js/index.js


gsed -i '/import com.worklight.androidgap.api.WL;/aimport com.worklight.androidgap.api.WLActionReceiver;\nimport org.json.JSONException;\nimport org.json.JSONObject;\nimport fi.iki.elonen.NanoHTTPD;\nimport fi.iki.elonen.util.ServerRunner;\n' ./platforms/android/src/io/cordova/hellocordova/MainActivity.java
gsed -i 's/implements WLInitWebFrameworkListener/implements WLInitWebFrameworkListener, WLActionReceiver/g' ./platforms/android/src/io/cordova/hellocordova/MainActivity.java
gsed -i '/implements WLInitWebFrameworkListener/a\\tpublic AutomationServer server;' ./platforms/android/src/io/cordova/hellocordova/MainActivity.java
gsed -i '/onInitWebFrameworkComplete/a\\t\tif (server == null){\
\t\t\ttry {\
\t\t\t\tserver = new AutomationServer();\
\t\t\t\tserver.start();\n\t\t\t} catch (Exception e) {}\
\t\t\t}' ./platforms/android/src/io/cordova/hellocordova/MainActivity.java
gsed -i '$ d' ./platforms/android/src/io/cordova/hellocordova/MainActivity.java
cat ./../hybridTests/mainActivityChanges.txt >> ./platforms/android/src/io/cordova/hellocordova/MainActivity.java

cp ./../hybridTests/nanohttpd-2.2.0.jar ./platforms/android/libs

cordova compile

gsed -i 's/10.0.0.1/ibobs-mac-mini.haifa.ibm.com/g' ./config.xml
