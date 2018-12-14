---
author: Lewis Denham-Parry
date: 2017-11-20T12:07:41Z
description: ""
draft: true
slug: push-files-to-azure-blob
title: Push files to Azure Blob
---

```bash
# COMPILE
read -p "Build Angular? (Y/N)" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd ..
    ng build --prod --aot=false
    cd etc
fi
# RENAME
read -p "Version files? (Y/N)" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "What is the version number for the release?"
    read VERSION_NUMBER
    # CLEAN FOLDER
    rm ../dist/3rdpartylicenses.txt
    rm ../dist/favicon.ico
    rm ../dist/index.html
    # CSS
    mv ../dist/styles.*.bundle.css ../dist/styles.$VERSION_NUMBER.css
    # FONTS
    mv ../dist/open-iconic.*.woff ../dist/open-iconic.$VERSION_NUMBER.woff
    mv ../dist/open-iconic.*.ttf ../dist/open-iconic.$VERSION_NUMBER.ttf
    mv ../dist/open-iconic.*.otf ../dist/open-iconic.$VERSION_NUMBER.otf
    mv ../dist/open-iconic.*.eot ../dist/open-iconic.$VERSION_NUMBER.eot
    mv ../dist/open-iconic.*.svg ../dist/open-iconic.$VERSION_NUMBER.svg
    # SCRIPTS
    mv ../dist/inline.*.bundle.js ../dist/inline.$VERSION_NUMBER.js
    mv ../dist/main.*.bundle.js ../dist/main.$VERSION_NUMBER.js
    mv ../dist/polyfills.*.bundle.js ../dist/polyfills.$VERSION_NUMBER.js
    mv ../dist/scripts.*.bundle.js ../dist/scripts.$VERSION_NUMBER.js
    mv ../dist/vendor.*.bundle.js ../dist/vendor.$VERSION_NUMBER.js
fi
# EXPORT
read -p "Publish files to CDN? (Y/N)" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    export AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=tigerbay;AccountKey=b5YrSfIge4Dcv1aKlzBLWeS16OpZJFY7lzWXhCcsMyHz/MuvcRbhS3Hl2B09n/XI6XuzBWLJ8bmTt9/737H84w==;EndpointSuffix=core.windows.net"
    cd ..
    cd dist
    for f in *
    do
        echo "Processing $f..."
        az storage blob upload --file $f --container-name cdn --name $f
    done
fi
```

## References

[Storage Azure Cli](https://docs.microsoft.com/en-us/azure/storage/common/storage-azure-cli)
[How to determine if a bash variable is empty](https://serverfault.com/questions/7503/how-to-determine-if-a-bash-variable-is-empty)
[Bash loop over file](https://www.cyberciti.biz/faq/bash-loop-over-file/)