#!/bin/bash
# deploy.sh

echo "Starting deployment to Cloudflare R2..."

# Upload all files to R2
echo "Uploading files to R2 bucket..."

wrangler r2 object put economic-data-visualizer/index.html --file=./index.html

# Upload directories
upload_dir() {
  local dir=$1
  local prefix=$2
  for file in $(find $dir -type f); do
    # Remove leading ./
    file=${file#./}
    wrangler r2 object put "economic-data-visualizer/$prefix${file#$dir/}" --file="./$file"
  done
}

# Upload directories
upload_dir "js" "js/"
upload_dir "data" "data/"
upload_dir "public" "public/"

# Deploy worker
echo "Deploying Cloudflare Worker..."
wrangler deploy

echo "Deployment complete! Your app should be live shortly."
