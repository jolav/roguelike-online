#!/bin/bash
# bash build.sh

# Load external configuration
source /home/"$USER"/.builds/prologue.conf
#source /home/$(whoami)/.builds/prologue.conf

print "$OUT_DIR"

# Remove folder if it exists
if [ -d "$OUT_DIR" ]; then
  rm -r "$OUT_DIR"
fi

# Create output folder
mkdir -p "$OUT_DIR"

# Copy files
cp -r "$SRC_DIR/assets" "$OUT_DIR/assets"
cp "$SRC_DIR/index.html" "$OUT_DIR"

# Compile JS
esbuild "$SRC_DIR/index.js" --bundle --outfile="$OUT_DIR/index.js" --minify

sleep 1

rsync -avz --delete -e "sshpass -p '"$PASS"' ssh -o StrictHostKeyChecking=no" --progress "$SOURCE" "$DESTINATION"
