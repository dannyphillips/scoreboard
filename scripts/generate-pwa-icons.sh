#!/bin/bash

# Create the icons directory if it doesn't exist
mkdir -p public/images/icons

# Generate icons from source image (assuming source is public/images/logo-light.png)
convert public/images/logo-light.png -resize 72x72 public/images/icons/icon-72x72.png
convert public/images/logo-light.png -resize 96x96 public/images/icons/icon-96x96.png
convert public/images/logo-light.png -resize 128x128 public/images/icons/icon-128x128.png
convert public/images/logo-light.png -resize 144x144 public/images/icons/icon-144x144.png
convert public/images/logo-light.png -resize 152x152 public/images/icons/icon-152x152.png
convert public/images/logo-light.png -resize 192x192 public/images/icons/icon-192x192.png
convert public/images/logo-light.png -resize 384x384 public/images/icons/icon-384x384.png
convert public/images/logo-light.png -resize 512x512 public/images/icons/icon-512x512.png

echo "PWA icons generated successfully!" 