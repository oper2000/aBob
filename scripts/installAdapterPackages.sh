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
cd adapter-maven-buildall/adapter-maven/
chmod 777 ./*
./install-adapter.sh
rc=$?; if [[ $rc != 0 ]]; then
echo ***adapter-maven-buildall failed***; exit $rc; fi

cd /Users/bob/Documents/Developer/Quickbuild/

if [ -d "./security-maven-buildall" ]; then
rm -rf ./security-maven-buildall
fi

if [ -f "./security-maven-buildall.zip" ]; then
rm  ./security-maven-buildall.zip
fi

curl -o security-maven-buildall.zip http://halpert.austin.ibm.com/productionBuilds-electra-devops/LATEST-RELEASE/security-maven-buildall.zip

mkdir security-maven-buildall
unzip security-maven-buildall.zip -d security-maven-buildall
cd security-maven-buildall/security-maven/scripts
chmod 777 ./*
./install-security-checks.sh
rc=$?; if [[ $rc != 0 ]]; then
echo ***security-maven-buildall: install-security-checks.sh failed***; exit $rc; fi
./install-java-token-validator.sh
rc=$?; if [[ $rc != 0 ]]; then
echo ***security-maven-buildall: install-java-token-validator failed***; exit $rc; fi