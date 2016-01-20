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
cat ./../SDKTest.js >> ./www/js/index.js

cordova compile


