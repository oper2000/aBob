cd /Users/bob/Documents/Developer/Quickbuild/

if [ -d "./adapter-maven-buildall" ]; then
rm -rf ./adapter-maven-buildall
fi

if [ -f "./adapter-maven-buildall.zip" ]; then
rm  ./adapter-maven-buildall.zip
fi

curl -o adapter-maven-buildall.zip http://halpert.austin.ibm.com/productionBuilds-electra-devops/LATEST-RELEASE/adapter-maven-buildall.zip

mkdir adapter-maven-buildall
unzip adapter-maven-buildall.zip -d adapter-maven-buildall
cd adapter-maven-buildall
unzip adapter-maven.zip

source ~/.bash_profile
for d in */ ; do
 cd "$d"
 pwd
 mvn clean install:install-file -Dfile="${d%?}.jar" -DpomFile=pom.xml
 cd ../
done