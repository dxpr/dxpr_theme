#!/bin/bash
# Script to quickly create sub-theme.

echo '
+------------------------------------------------------------------------+
| With this script you could quickly create DXPR sub-theme               |
+------------------------------------------------------------------------+
'
parentfoldername="$(basename "$(dirname $PWD)")"
echo "${DIRECTORY}"
if [ "${parentfoldername}" != "contrib" ]; then
  echo 'Error: The dxpr_theme theme (this folder) should be in the "contrib" folder!'
  exit
fi

echo 'You must enter  name! [e.g. My Custom DXPR Theme]'
read CUSTOM_DXPR_THEME_NAME
if [ -z "${CUSTOM_DXPR_THEME_NAME}" ]; then
  echo 'Error: You must enter name! [e.g. My Custom DXPR Theme]'
  exit
fi

echo 'The machine name of your custom theme? [e.g. my_custom_dxpr_theme]'
read CUSTOM_DXPR_THEME
if [ -z "${CUSTOM_DXPR_THEME}" ]; then
  echo 'Error: You must enter machine name of your custom theme? [e.g. my_custom_dxpr_theme]'
  exit
fi

if [[ ! -e ../../custom ]]; then
  mkdir ../../custom
fi

cd ../../custom
cp -r ../contrib/dxpr_theme/dxpr_theme_STARTERKIT $CUSTOM_DXPR_THEME
cd $CUSTOM_DXPR_THEME
for file in *dxpr_theme_STARTERKIT.*; do mv $file ${file//dxpr_theme_STARTERKIT/$CUSTOM_DXPR_THEME}; done
for file in config/*/*dxpr_theme_STARTERKIT.*; do mv $file ${file//dxpr_theme_STARTERKIT/$CUSTOM_DXPR_THEME}; done
# Difference of commands is i ''
if [[ "$OSTYPE" == "darwin"* ]]; then
  grep -Rl dxpr_theme_STARTERKIT . | xargs sed -i '' -e "s/dxpr_theme_STARTERKIT/$CUSTOM_DXPR_THEME/"
else
  grep -Rl dxpr_theme_STARTERKIT . | xargs sed -i -e "s/dxpr_theme_STARTERKIT/$CUSTOM_DXPR_THEME/"
fi
sed -i -e "s/THEMETITLE/$CUSTOM_DXPR_THEME_NAME/" $CUSTOM_DXPR_THEME.info.yml config/schema/$CUSTOM_DXPR_THEME.schema.yml
echo "# Check the themes/custom folder for your new sub-theme."
