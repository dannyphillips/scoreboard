#!/bin/bash

# Function to optimize images in a directory
optimize_images() {
    local src_dir=$1
    local dest_dir=$2
    echo "Optimizing images from $src_dir to $dest_dir"
    
    # Create destination directory if it doesn't exist
    mkdir -p "$dest_dir"
    
    # Find all PNG and JPG files in the directory
    find "$src_dir" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) | while read -r img; do
        # Get relative path from src_dir
        rel_path=${img#$src_dir/}
        # Create subdirectories in destination if needed
        mkdir -p "$(dirname "$dest_dir/$rel_path")"
        
        echo "Optimizing: $rel_path"
        
        # Get image dimensions
        dimensions=$(magick identify -format "%wx%h" "$img")
        width=$(echo $dimensions | cut -d'x' -f1)
        
        # If width is greater than 1000px, scale it down
        if [ "$width" -gt 1000 ]; then
            echo "Resizing large image: $rel_path"
            magick "$img" -resize 1000x -quality 85 -strip "$dest_dir/$rel_path"
        else
            # Just optimize without resizing
            magick "$img" -quality 85 -strip "$dest_dir/$rel_path"
        fi
    done
}

# Create optimized directory
optimized_dir="public/images_optimized"
echo "Creating optimized images in $optimized_dir"

# Optimize images in each directory
optimize_images "public/images/games" "$optimized_dir/games"
optimize_images "public/images/teams" "$optimized_dir/teams"
optimize_images "public/images" "$optimized_dir"

echo "Image optimization complete! Optimized images are in $optimized_dir"
echo "You can compare the optimized versions with the originals and replace them if satisfied." 