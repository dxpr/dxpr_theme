#!/bin/bash

echo "Updating DXB Slider package with npm..."
npm update dxb_slider

SLIDER_JS_SRC="./node_modules/dxb_slider/dxb-slider.min.js"
SLIDER_CSS_SRC="./node_modules/dxb_slider/dxb-slider.min.css"
VENDOR_SLIDER_JS_DEST="./vendor/dxb-slider/dxb-slider.min.js"
VENDOR_SLIDER_CSS_DEST="./vendor/dxb-slider/dxb-slider.min.css"

COLOR_WHEEL_JS_SRC="./node_modules/reinvented-color-wheel/iife/reinvented-color-wheel.min.js"
COLOR_WHEEL_CSS_SRC="./node_modules/reinvented-color-wheel/css/reinvented-color-wheel.min.css"
VENDOR_COLOR_WHEEL_JS_DEST="./vendor/color-wheel/reinvented-color-wheel.min.js"
VENDOR_COLOR_WHEEL_CSS_DEST="./vendor/color-wheel/reinvented-color-wheel.min.css"

echo "Creating vendor directories if they do not exist..."
mkdir -p "$(dirname "$VENDOR_SLIDER_JS_DEST")"
mkdir -p "$(dirname "$VENDOR_COLOR_WHEEL_JS_DEST")"

echo "Copying DXB Slider files to vendor folder..."
cp "$SLIDER_JS_SRC" "$VENDOR_SLIDER_JS_DEST" || echo "Warning: $SLIDER_JS_SRC not found"
cp "$SLIDER_CSS_SRC" "$VENDOR_SLIDER_CSS_DEST" || echo "Warning: $SLIDER_CSS_SRC not found"

echo "Copying Reinvented Color Wheel files to vendor folder..."
cp "$COLOR_WHEEL_JS_SRC" "$VENDOR_COLOR_WHEEL_JS_DEST" || echo "Warning: $COLOR_WHEEL_JS_SRC not found"
cp "$COLOR_WHEEL_CSS_SRC" "$VENDOR_COLOR_WHEEL_CSS_DEST" || echo "Warning: $COLOR_WHEEL_CSS_SRC not found"

echo "Vendor assets updated successfully."
