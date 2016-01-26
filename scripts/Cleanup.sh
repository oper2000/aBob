Root_Dir=/Users/bob/Documents/Developer/Quickbuild/Reports
foldername=$(date +%Y%m%d%H%M)
mkdir "$Root_Dir/old/$foldername"
cp -r "$Root_Dir/latest/." "$Root_Dir/old/$foldername/"