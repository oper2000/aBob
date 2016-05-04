cd /Users/bob/Documents/Developer/Quickbuild/

if [ -d "./mfp-maven-central-artifacts-adapter" ]; then
rm -rf ./mfp-maven-central-artifacts-adapter
fi

if [ -f "./mfp-maven-central-artifacts-adapter.zip" ]; then
rm  ./mfp-maven-central-artifacts-adapter.zip
fi

curl -o mfp-maven-central-artifacts-adapter.zip http://halpert.austin.ibm.com/productionBuilds-electra-devops/LATEST-RELEASE/mfp-maven-central-artifacts-adapter.zip

mkdir mfp-maven-central-artifacts-adapter
unzip mfp-maven-central-artifacts-adapter.zip -d mfp-maven-central-artifacts-adapter
cd mfp-maven-central-artifacts-adapter/mfp-maven-central-artifacts-adapter/
chmod 777 ./*
./install.sh
rc=$?; if [[ $rc != 0 ]]; then
echo ***mfp-maven-central-artifacts-adapter failed***; exit $rc; fi