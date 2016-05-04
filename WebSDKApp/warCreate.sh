rm -fr SDKApp.war
zip -r SDKApp.war public
rm -f /Users/SEitan/Downloads/mfp-server-all-in-one/mfp-server/usr/servers/mfp/dropins/SDKApp.war
mv SDKApp.war /Users/SEitan/Downloads/mfp-server-all-in-one/mfp-server/usr/servers/mfp/dropins/
/Users/SEitan/Downloads/mfp-server-all-in-one/stop.sh
/Users/SEitan/Downloads/mfp-server-all-in-one/run.sh
