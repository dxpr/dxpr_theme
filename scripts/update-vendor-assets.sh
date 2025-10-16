#!/bin/bash

echo "Updating vendor packages with npm..."
npm update dxb_slider reinvented-color-wheel bs-enhanced-dropdowns

# Map of source directories to destination directories
declare -A packages=(
  ["./node_modules/dxb_slider"]="vendor/dxb-slider"
  ["./node_modules/reinvented-color-wheel"]="vendor/color-wheel"
  ["./node_modules/bs-enhanced-dropdowns"]="vendor/enhanced-dropdowns"
)

echo "Emptying vendor folder..."
rm -rf vendor/*

echo "Copying vendor packages..."
for src in "${!packages[@]}"; do
  dest="${packages[$src]}"
  mkdir -p "$dest"
  cp -r "$src"/* "$dest" || echo "Warning: Failed to copy files from $src to $dest"
done

echo "Vendor assets updated successfully."
