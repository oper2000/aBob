source ~/.bash_profile
echo $1
#echo "replacing ibmmobilefirstplatformfoundation.aar"
#yes | cp /Users/bob/Documents/Developer/Quickbuild/SDK/ibmmobilefirstplatformfoundation.aar $1app/libs/ibmmobilefirstplatformfoundation.aar
$1gradlew assembleDebug -p $1
rc=$?; if [[ $rc != 0 ]]; then
echo ***build failed***; exit $rc; fi