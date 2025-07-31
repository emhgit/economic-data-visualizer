// scripts/deploy.js
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("Starting deployment to Cloudflare R2...");

require('dotenv').config();
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_BUCKET_NAME) {
  console.error("Error: R2_BUCKET_NAME environment variable is not set");
  process.exit(1);
}

// Function to run shell commands
function runCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Upload all files to R2
console.log("Uploading files to R2 bucket...");

runCommand(`wrangler r2 object put ${R2_BUCKET_NAME}/index.html --file=./index.html`);

// Upload directories
function uploadDir(dir, prefix) {
  console.log(`Uploading directory: ${dir}`);
  const files = getAllFiles(dir);

  for (const file of files) {
    const relativePath = path.relative(dir, file);
    const r2Path = `${prefix}${relativePath.replace(/\\/g, '/')}`; // Ensure forward slashes for R2
    runCommand(`wrangler r2 object put "${R2_BUCKET_NAME}/${r2Path}" --file="./${file}"`);
  }
}

// Helper function to get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}


uploadDir("js", "js/");
uploadDir("data", "data/");
uploadDir("public", "public/");

// Deploy worker
console.log("Deploying Cloudflare Worker...");
runCommand("wrangler deploy");

console.log("Deployment complete! Your app should be live shortly.");