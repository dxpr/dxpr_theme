#!/bin/bash

# 1. Update DXB Slider using npm (ako želiš uključiti automatsko ažuriranje)
echo "Updating DXB Slider package with npm..."
npm update dxb_slider

# 2. Define source and destination paths
SLIDER_JS_SRC="./node_modules/dxb_slider/dxb-slider.min.js"
SLIDER_CSS_SRC="./node_modules/dxb_slider/dxb-slider.min.css"
VENDOR_JS_DEST="./vendor/dxb_slider/dxb-slider.min.js"
VENDOR_CSS_DEST="./vendor/dxb_slider/dxb-slider.min.css"

# 3. Create vendor directory if it does not exist
echo "Creating vendor directory if not exists..."
mkdir -p "$(dirname "$VENDOR_JS_DEST")"

# 4. Move minified JS and CSS files to the vendor folder
echo "Moving files to the vendor folder..."
cp "$SLIDER_JS_SRC" "$VENDOR_JS_DEST"
cp "$SLIDER_CSS_SRC" "$VENDOR_CSS_DEST"

echo "DXB Slider package updated and files moved to vendor folder."
