#! /bin/sh
echo Uploading the dev-files to test-environment ...
# Start of "here" document
ftp -nv homebridge << EOF
user pi xxxxx
bin
cd homebridge-shelly
cd dist
put /dist/* 
END

# End of "here" document
echo FTP ended - your web site is now marked as UP.